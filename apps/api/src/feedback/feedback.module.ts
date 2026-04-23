import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { ChatHistory } from 'src/history/history.entity';
import { Feedback } from './ feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, ChatHistory])],
  providers: [FeedbackService],
  exports: [FeedbackService], // 🔥 MUST BE HERE
})
export class FeedbackModule {}