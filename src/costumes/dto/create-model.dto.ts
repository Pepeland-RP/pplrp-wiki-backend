import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModelDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
