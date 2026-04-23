import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistory } from './history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { Bookmark } from 'src/book-mark/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistory, Bookmark])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}