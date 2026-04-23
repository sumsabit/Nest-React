import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

  @Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Get current logged-in user
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  // ✅ Update profile
  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  // ✅ Change password
 @Patch('change-password')
changePassword(
  @Request() req,
  @Body() body: { currentPassword: string; newPassword: string },
) {
  return this.usersService.changePassword(
    req.user.id,
    body.currentPassword,
    body.newPassword,
  );
}
  @Post()
create(@Body() body) {
  return this.usersService.create(body);
}


  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }
}
