import { PartialType } from '@nestjs/mapped-types';
import { CreateLawDto } from './createLaw.dto';

export class UpdateLawDto extends PartialType(CreateLawDto) {}
