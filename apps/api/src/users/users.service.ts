import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './users.entity';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ================================
  // ✅ CREATE USER (NO DOUBLE HASH)
  // ================================
  async create(data: Partial<User>): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    // hash ONLY here (single source of truth)
    data.password = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // ================================
  // ✅ FIND METHODS
  // ================================
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ================================
  // ✅ UPDATE USER
  // ================================
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);

    // prevent password update here (use changePassword instead)
    if ((dto as any).password) {
      throw new BadRequestException(
        'Use changePassword endpoint to update password',
      );
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // ================================
  // ✅ CHANGE PASSWORD
  // ================================
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  // ================================
  // ✅ RESET TOKEN SUPPORT
  // ================================
  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetToken: token },
    });
  }

  async save(user: User) {
    return this.userRepository.save(user);
  }

  // ================================
  // ✅ COUNTS (FOR DASHBOARD)
  // ================================
  async countUsers() {
    return this.userRepository.count();
  }

  async countAdmins() {
    return this.userRepository.count({
      where: { role: 'admin' },
    });
  }

  // ================================
  // ✅ OPTIONAL USER STATS
  // ================================
  async getUserStats(userId: string) {
    // placeholder (you can connect real data later)
    return {
      bookmarks: 0,
      searches: 0,
      chatSessions: 0,
    };
  }
}
