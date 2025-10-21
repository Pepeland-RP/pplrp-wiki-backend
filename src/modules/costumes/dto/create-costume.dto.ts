import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCostumeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
