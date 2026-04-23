import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/createBookmark.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  // CREATE
  @Post()
  create(@Req() req, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.create(req.user.id, dto.historyId);
  }

  // LIST
  @Get()
  findMyBookmarks(@Req() req) {
    return this.bookmarkService.findUserBookmarks(req.user.id);
  }

  // CHECK
  @Get('check/:historyId')
  check(@Req() req, @Param('historyId') historyId: string) {
    return this.bookmarkService.checkBookmark(
      req.user.id,
      Number(historyId),
    );
  }

  // DELETE
  @Delete(':bookmarkId')
  remove(@Param('bookmarkId') bookmarkId: string, @Req() req) {
    return this.bookmarkService.remove(Number(bookmarkId), req.user.id);
  }
}