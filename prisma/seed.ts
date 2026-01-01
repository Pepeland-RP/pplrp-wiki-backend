/*
import { PrismaClient } from '@prisma/client';
import { readdir } from 'fs/promises';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.$connect();

  const contents = await readdir('uploads', {
    withFileTypes: true,
  });

  const gltfs = contents.filter(i => i.isFile()).map(i => i.name);

  for (const costume of gltfs) {
    await prisma.costume.create({
      data: {
        name: costume.split('.')[0],
        Gltf: { create: { resource_id: costume } },
      },
    });
  }
};

main()
  .then(() => console.log('Success'))
  .catch(console.error);
*/