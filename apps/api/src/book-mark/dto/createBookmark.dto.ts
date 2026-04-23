import { IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  historyId: number;
}