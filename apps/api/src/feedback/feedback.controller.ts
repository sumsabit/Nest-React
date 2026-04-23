import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('feedback')
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    @Post()
@UseGuards(JwtAuthGuard)
create(
  @Req() req,
  @Body() dto: CreateFeedbackDto,
) {
  return this.feedbackService.create(req.user.id, dto);
}
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
findAll() {
  return this.feedbackService.findAll();
}

@Patch(':id/review')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
markReviewed(@Param('id') id: number) {
  return this.feedbackService.markReviewed(id);
}
}