import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from 'src/users/users.module';
import { LawModule } from 'src/laws/law.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    LawModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService], 
})
export class AdminModule {}
