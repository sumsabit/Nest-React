import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HistoryService } from '../history/history.service';

@Injectable()
export class ChatService {
  constructor(private readonly historyService: HistoryService) {}

  async askNasBot(message: string, userId: string) {
    if (!message || !userId) {
      throw new Error('userId or message is missing');
    }

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message,
        session_id: userId,
      });

      const answer = response.data.response || response.data;

      const savedHistory = await this.historyService.saveChat(
        message,
        answer,
        userId
      );

      return {
        answer,
        historyId: savedHistory.id,
      };
    } catch (err) {
      console.error('Error contacting NAS bot:', err.message);
      throw new Error('Failed to get response from NAS bot');
    }
  }
}