import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LawService } from 'src/laws/law.service';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/CreateAdminDto.dto';


@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private lawService: LawService,
  ) {}

  dashboard() {
    return {
      message: 'Admin dashboard working',
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    const email = dto.email.toLowerCase();

    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersService.create({
      name: dto.name,
      email,
      password: hashedPassword,
      role: 'admin', // forced role
    });
  }

  getUsers() {
    return this.usersService.findAll();
  }

  async getStats() {
    const totalUsers = await this.usersService.countUsers();
    const totalAdmins = await this.usersService.countAdmins();
    const totalLaws = await this.lawService.countLaws();

    return {
      users: totalUsers,
      admins: totalAdmins,
      laws: totalLaws,
    };
  }

  createLaw(dto: any) {
    return this.lawService.create(dto);
  }

  updateLaw(id: string, dto: any) {
    return this.lawService.update(id, dto);
  }

  deleteLaw(id: string) {
    return this.lawService.remove(id);
  }
  async getContent() {
  return this.lawService.getAllLawsFromAI();
}


async createContent(dto: any) {
  return this.lawService.create(dto);
}

async updateContent(id: string, dto: any) {
  return this.lawService.update(id, dto);
}

async deleteContent(id: string) {
  return this.lawService.remove(id);
}

}