import { IsString, IsOptional } from 'class-validator';

export class UpdateLawDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  language?: string;
}