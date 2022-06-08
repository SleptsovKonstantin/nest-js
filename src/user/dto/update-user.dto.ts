import { IsString, IsEmail } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  password?: string;
}
