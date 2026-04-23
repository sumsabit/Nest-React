import {IsString} from 'class-validator';
export class UserResponseDto {
    @IsString()
    id: string;
    @IsString()
    name: string;
    @IsString()
    email: string;
}
       