import { InjectRepository } from "@nestjs/typeorm";
import { ChatHistory } from "./history.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BadRequestException} from '@nestjs/common';
import { Bookmark } from "src/book-mark/bookmark.entity";

@Injectable()

export class HistoryService {
  constructor(
    @InjectRepository(ChatHistory)
    private readonly historyRepo: Repository<ChatHistory>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepo: Repository<Bookmark>,
  ) {}

 async saveBookmark(historyId: number, userId: string) {
  const history = await this.historyRepo.findOne({
    where: {
      id: historyId,
      user: { id: userId },
    },
  });

  if (!history) {
    throw new NotFoundException('History not found');
  }

  const exists = await this.bookmarkRepo.findOne({
    where: {
      history: { id: historyId },
      user: { id: userId },
    },
  });

  if (exists) {
    throw new BadRequestException('Already bookmarked');
  }

  const bookmark = this.bookmarkRepo.create({
    history,
    user: { id: userId } as any,
  });

  return this.bookmarkRepo.save(bookmark);
}
async saveChat(question: string, answer: string, userId: string) {
  if (!userId) throw new Error('userId is missing');

  const chat = this.historyRepo.create({
    question,
    answer,
    user: { id: userId },
  });

  return await this.historyRepo.save(chat);
}
async deleteHistory(historyId: number, userId: string) {
  // 1. Ensure the history exists and belongs to the user
  const history = await this.historyRepo.findOne({
    where: {
      id: historyId,
      user: { id: userId },
    },
  });

  if (!history) {
    throw new NotFoundException('History not found');
  }

  // 2. Check if any bookmarks reference this history (efficient count)
  const bookmarkCount = await this.bookmarkRepo.count({
    where: {
      history: { id: historyId },
    },
  });

  if (bookmarkCount > 0) {
    throw new BadRequestException(
      'Cannot delete history with existing bookmarks. Delete bookmarks first.'
    );
  }

  // 3. Delete history
  await this.historyRepo.remove(history);

  return { message: 'History deleted successfully' };
}

  async getUserHistory(userId: string) {
    return this.historyRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }
  
}