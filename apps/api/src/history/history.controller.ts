import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  getUserHistory(@Req() req) {
    return this.historyService.getUserHistory(req.user.id);
  }

  @Delete(':id')
  deleteHistory(@Param('id') id: string, @Req() req) {
    return this.historyService.deleteHistory(Number(id), req.user.id);
  }
}