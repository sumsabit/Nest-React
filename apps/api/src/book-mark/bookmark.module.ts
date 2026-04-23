// src/bookmark/bookmark.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookmarkController } from './bookmark.controller';
import { User } from '../users/users.entity';
import { Bookmark } from './bookmark.entity';
import { ChatHistory } from '../history/history.entity';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ChatHistory, Bookmark]), // <--- Add ChatHistory and Bookmark here
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
