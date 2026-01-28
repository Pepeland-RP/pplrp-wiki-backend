import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMinecraftItemDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  str_id: string;
}

export class CreateModelDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  season: string;

  @IsNotEmpty()
  @Transform(i => JSON.parse(i.value))
  @IsInt({ each: true })
  minecraftItem: number[];

  @IsNotEmpty()
  @Transform(i => JSON.parse(i.value))
  @IsString({ each: true })
  category: string[];

  // Будем уповать на чудо и что никакие шаловливые ручки не засунут сюда что-то кроме json
  @IsOptional()
  @Transform(i => JSON.parse(i.value))
  gltfMeta: object;
}
