import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ModelSearchQueryDTO {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    console.log(value);
    if (!value) return [];
    return value.split(',').map(Number);
  })
  @IsNumber(
    {},
    {
      each: true,
      message(validationArguments) {
        return (
          `\`${validationArguments.property}\` property must be an array of IDs, ` +
          `like \`1,2,10\`, but \`${validationArguments.value}\` was provided instead`
        );
      },
    },
  )
  seasons?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    return value.split(',').map(Number);
  })
  @IsNumber(
    {},
    {
      each: true,
      message(validationArguments) {
        return (
          `\`${validationArguments.property}\` property must be an array of IDs, ` +
          `like \`1,2,10\`, but \`${validationArguments.value}\` was provided instead`
        );
      },
    },
  )
  categories?: number[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  take?: number;
}
