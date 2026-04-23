import { Controller, Get, Post, Body, Query, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { LawService } from './law.service';
import { CreateLawDto } from './dto/createLaw.dto';
import { UpdateLawDto } from './dto/updateLaw.dto';
import { QueryLawDto } from './dto/queryLaw.dto';
import { ParseUUIDPipe } from '@nestjs/common';



@Controller('laws')
export class LawController {
  constructor(private  service: LawService){}
 
 
 @Post()
create(@Body() dto: CreateLawDto) {
  return this.service.create(dto);
}


@Patch(':id')
update(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body() dto: UpdateLawDto,
) {
  return this.service.update(id, dto);
}

 
@Delete(':id')
remove(
  @Param('id', new ParseUUIDPipe()) id: string,
) {
  return this.service.remove(id);
}

  @Get()
  getLaws(@Query() query: QueryLawDto) {
   return this.service.findAll(query);
  }
}