import { IsString, IsOptional } from 'class-validator';

export class CreateLawDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  language?: string;
}