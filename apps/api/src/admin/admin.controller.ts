
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAdminDto } from './dto/CreateAdminDto.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // USERS
  @Post('create-admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

 @Get('stats')
getStats() {
  return {
    stats: this.adminService.getStats(),
  };
}

@Get('content')
async getContent() {
  const content = await this.adminService.getContent();
  return { content };
}
@Get('content/stats')
async getContentStats() {
  const content = await this.adminService.getContent();

  const stats = {
    total: content.length,
    published: content.filter(c => c.status === 'published').length,
    draft: content.filter(c => c.status === 'draft').length,
    archived: content.filter(c => c.status === 'archived').length,
  };

  return { stats };
}
@Patch('content/:id/status')
updateStatus(@Param('id') id: string, @Body() body: any) {
  return this.adminService.updateContent(id, { status: body.status });
}
@Get('recent-activity')
getRecentActivity() {
  return {
    activities: [] // you can implement later
  };
}

@Get('content-stats')
async getContentStatsSimple() {
  const content = await this.adminService.getContent();

  return {
    total: content.length
  };
}

  @Post('content')
  createContent(@Body() dto: any) {
    return this.adminService.createContent(dto);
  }

  @Put('content/:id')
  updateContent(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.updateContent(id, dto);
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }


}
