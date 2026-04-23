import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { FeedbackType } from '../ feedback.entity';
import { Type } from 'class-transformer';


export class CreateFeedbackDto {
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsOptional()
  @IsString()
  comment?: string;

  @Type(() => Number)
  @IsInt()
  chatId: number;
}


 
