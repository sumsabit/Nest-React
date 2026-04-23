import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLawDto {

  @IsString()
  @IsNotEmpty()
  article_number: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  simple_explanation?: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsUUID()
  category_id: string;
}
