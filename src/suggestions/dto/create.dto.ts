import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSuggestionDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;

  @Transform(i => JSON.parse(i.value))
  @IsString({ each: true })
  links: string[];
}
