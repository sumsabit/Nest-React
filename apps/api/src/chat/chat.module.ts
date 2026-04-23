import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HistoryModule } from '../history/history.module';
import { FeedbackModule } from '../feedback/feedback.module'; // ✅ ADD THIS

@Module({
  imports: [
    HistoryModule,
    FeedbackModule, // ✅ ADD THIS
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}