import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryLawDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  language?: string;
}
