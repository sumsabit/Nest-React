import { IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  status: 'draft' | 'published' | 'archived';
}