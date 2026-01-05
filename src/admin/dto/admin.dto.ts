import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMinecraftItemDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  str_id: string;
}
