import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(6)
  fullName: string;

  @IsString()
  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;

  @IsString()
  @Length(6, 32, { message: 'Пароль должен быть минимум 6 символов' })
  password?: string;
}
