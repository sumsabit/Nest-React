import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { Law } from './law.entity';
import { CreateLawDto } from './dto/createLaw.dto';
import { UpdateLawDto } from './dto/updateLaw.dto';
import { QueryLawDto } from './dto/queryLaw.dto';

@Injectable()
export class LawService {
  constructor(
    @InjectRepository(Law)
    private lawRepository: Repository<Law>,
  ) {}

  // ================================
  // ✅ AI / ChromaDB (nasbot)
  // ================================

  async getAllLawsFromAI() {
    try {
      const response = await axios.get('http://localhost:8000/laws');
      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch laws from AI service');
    }
  }

  async ask(question: string) {
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        question,
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException('AI service is not responding');
    }
  }

  // ================================
  // ✅ PostgreSQL (TypeORM)
  // ================================

  async create(dto: CreateLawDto) {
    const law = this.lawRepository.create(dto);
    return this.lawRepository.save(law);
  }

  async findAll(query: QueryLawDto) {
    const { page = 1, limit = 10, language } = query;

    return this.lawRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: language ? { language } : {},
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const law = await this.lawRepository.findOne({ where: { id } });

    if (!law) {
      throw new NotFoundException('Law not found');
    }

    return law;
  }

  async update(id: string, dto: UpdateLawDto) {
    const law = await this.lawRepository.preload({
      id,
      ...dto,
    });

    if (!law) {
      throw new NotFoundException('Law not found');
    }

    return this.lawRepository.save(law);
  }

  async remove(id: string) {
    const law = await this.findOne(id);
    return this.lawRepository.remove(law);
  }

  async countLaws() {
    return this.lawRepository.count();
  }
}
  
