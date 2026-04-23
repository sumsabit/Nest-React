import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { FeedbackService } from '../feedback/feedback.service';
import { HistoryService } from '../history/history.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly feedbackService: FeedbackService,
    private readonly historyService: HistoryService,
  ) {}

  // 1. CHAT
  @Post()
  async ask(@Body('message') message: string, @Req() req) {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) throw new Error('User not authenticated');

    return this.chatService.askNasBot(message, userId);
  }

  // 2. FEEDBACK
  @Post('feedback')
  async feedback(@Body() dto, @Req() req) {
    const userId = req.user?.userId || req.user?.id;
    return this.feedbackService.create(userId, dto);
  }

  // 3. BOOKMARK
  @Post('bookmark')
  async bookmark(@Body('historyId') historyId: number, @Req() req) {
    const userId = req.user?.userId || req.user?.id;

    return this.historyService.saveBookmark(historyId, userId);
  }
}