import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { copyFile, readdir, readFile } from 'fs/promises';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import { rmSync } from 'fs';
dotenv.config();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const main = async () => {
  await prisma.$connect();

  const costumes_raw = await readFile('prisma/seed_data/costumes.json');
  const costumes = JSON.parse(costumes_raw.toString());

  const processed_costumes: string[] = [];

  for (const costume of costumes) {
    const generated_assets: string[] = [];

    try {
      const costume_exists = await prisma.costume.findFirst({
        where: { name: costume.name },
      });
      if (!!costume_exists) {
        //console.log(`${costume.name} already exists`);
        processed_costumes.push(costume.name);
        continue;
      }

      await prisma.$transaction(async tx => {
        const gltf_uid = v4();
        await copyFile(
          `prisma/seed_data/models/${costume.name}.gltf`,
          `uploads/${gltf_uid}`,
        );
        generated_assets.push(gltf_uid);

        const gltf = await tx.gltf.create({
          data: { resource_id: gltf_uid },
        });

        let season = await tx.season.findFirst({
          where: { name: costume.season },
        });

        if (!season) {
          season = await tx.season.create({
            data: {
              name: costume.season,
              icon: null,
            },
          });
        }

        const categories: number[] = [];

        for (const category of costume.categories as string[]) {
          let cat = await tx.category.findFirst({
            where: { name: category },
          });

          if (!cat) {
            cat = await tx.category.create({
              data: { name: category },
            });
          }

          categories.push(cat.id);
        }

        const minecraft_items: number[] = [];
        for (const items of Object.values(costume.categoryImages)) {
          for (const item of items as string[]) {
            const item_name = item
              .split('/')
              .reverse()[0]
              .split('.')[0]
              .toLowerCase();

            const exist_item = await tx.minecraftItem.findFirst({
              where: { name: item_name },
            });

            if (exist_item) {
              minecraft_items.push(exist_item.id);
            } else {
              const item_uid = v4();
              await copyFile(
                `prisma/seed_data/items/${item_name}.png`,
                'uploads/' + item_uid,
              );

              generated_assets.push(item_uid);
              const new_item = await tx.minecraftItem.create({
                data: { name: item_name, resource_id: item_uid },
              });
              minecraft_items.push(new_item.id);
            }
          }
        }
        await tx.costume.create({
          data: {
            name: costume.name,
            seasonId: season.id,
            Gltf: {
              connect: { id: gltf.id },
            },
            Category: {
              connect: categories.map(id => ({ id })),
            },
            MinecraftItem: {
              connect: minecraft_items.map(id => ({ id })),
            },
          },
        });
      });

      processed_costumes.push(costume.name);
    } catch (e) {
      generated_assets.forEach(n => rmSync('uploads/' + n));
      console.error(e);
    }
  }

  const contents = await readdir('prisma/seed_data/models', {
    withFileTypes: true,
  });

  console.log(
    contents
      .filter(i => i.isFile())
      .map(i => i.name)
      .filter(c => !processed_costumes.includes(c.split('.')[0])),
  );
};

main()
  .then(() => console.log('Success'))
  .catch(console.error);
