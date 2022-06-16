import { Response } from 'express';
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { UserEntity } from 'src/user/entities/user.entity';

type TUser = {
  id: string;
  email: string;
  fullName: string;
  // lastName: string;
  // avatar: string;
};

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async googleLogin(user: TUser, res: Response) {
    try {
      if (!user) throw new Error('No user from google');

      let candidate = await this.usersRepository.findOne({
        where: {
          email: user.email,
        },
      });
      console.log('candidate', candidate);

      if (!candidate) {
        candidate = await this.usersRepository.save({
          email: user.email,
          fullName: user.fullName,
          // lastName: user.lastName,
          // avatarURL: user.avatar,
        });
      }

      const { refreshToken, accessToken } = this.tokenService.generateTokens({
        id: candidate.id,
        email: candidate.email,
      });

      await this.tokenService.saveToken(candidate.id, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.send({
        id: `${candidate.id}`,
        email: candidate.email,
        fullName: candidate.fullName,
        // lastName: candidate.lastName,
        // avatar: candidate.avatarURL,
        // status: candidate.status,
        accessToken,
      });
    } catch (err) {
      return res.send({ message: 'ErrorGoogleLogin' });
    }
  }
}
