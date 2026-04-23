import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatHistory } from 'src/history/history.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './ feedback.entity';
@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,

    @InjectRepository(ChatHistory)
    private readonly chatRepository: Repository<ChatHistory>,
  ) {}

 async create(userId: string, dto: CreateFeedbackDto) {
  const chat = await this.chatRepository.findOne({
    where: {
      id: dto.chatId,
      user: { id: userId },
    },
  });

  if (!chat) {
    throw new NotFoundException('Chat not found');
  }

  const exists = await this.feedbackRepository.exist({
    where: {
      user: { id: userId },
      chat: { id: dto.chatId },
    },
  });

  if (exists) {
    throw new BadRequestException('Feedback already exists for this chat');
  }

  const feedback = this.feedbackRepository.create({
    type: dto.type,
    comment: dto.comment,
    user: { id: userId } as any,
    chat,
  });

  return this.feedbackRepository.save(feedback);
}

  async findAll() {
    return this.feedbackRepository.find({
      relations: ['user', 'chat'],
    });
  }

  async markReviewed(id: number) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    feedback.reviewed = true;
    return this.feedbackRepository.save(feedback);
  }
}
