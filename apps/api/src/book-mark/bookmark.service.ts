import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { User } from 'src/users/users.entity';
import { ChatHistory } from 'src/history/history.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepo: Repository<Bookmark>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ChatHistory)
    private historyRepository: Repository<ChatHistory>,
  ) {}

  // CREATE
  async create(userId: string, historyId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const history = await this.historyRepository.findOneBy({ id: historyId });

    if (!user || !history) {
      throw new NotFoundException('User or History not found');
    }

    const existing = await this.bookmarkRepo.findOne({
      where: {
        user: { id: userId },
        history: { id: historyId },
      },
    });

    if (existing) return existing;

    const bookmark = this.bookmarkRepo.create({
      user,
      history,
    });

    return this.bookmarkRepo.save(bookmark);
  }

  // LIST (FIXED FORMAT FOR FRONTEND)
 async findUserBookmarks(userId: string) {
  const [items, total] = await this.bookmarkRepo.findAndCount({
    where: { user: { id: userId } },
    relations: ['history'],
    order: { createdAt: 'DESC' },
  });

  return {
    items,
    total,
  };
}
  // CHECK
  async checkBookmark(userId: string, historyId: number) {
    const bookmark = await this.bookmarkRepo.findOne({
      where: {
        user: { id: userId },
        history: { id: historyId },
      },
    });

    return { isBookmarked: !!bookmark };
  }

  // DELETE
  async remove(id: number, userId: string) {
    const bookmark = await this.bookmarkRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.bookmarkRepo.remove(bookmark);
  }
}