import { IsEmail, IsString, Length } from 'class-validator';

export class CreateTokenDto {
  @Length(1)
  id: string;
  @IsEmail()
  email: string;
}

export class ResultTokens {
  @IsString()
  id?: number;
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}
