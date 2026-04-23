import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Law } from './law.entity';
import { LawService } from './law.service';
import { LawController } from './law.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Law])],
  controllers: [LawController],
  providers: [LawService],
   exports: [LawService],

})
export class LawModule {}


