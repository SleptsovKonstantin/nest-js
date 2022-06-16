import { IsEmail, IsOptional, Length } from 'class-validator';

export class RegAuthDto {
  @IsEmail()
  email: string;
  @Length(3)
  fullName: string;
  @Length(6)
  password: string;
}
