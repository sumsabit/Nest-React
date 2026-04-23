import {IsString} from 'class-validator';
export class searchLawDto{

    @IsString()
    keyword: string;
}