import { sign, verify } from 'jsonwebtoken';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTokenDto, ResultTokens } from './dto/common.token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  generateTokens = (payload: CreateTokenDto): ResultTokens => {
    try {
      const accessToken: string = sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: '1d',
      });
      const refreshToken: string = sign(payload, process.env.JWT_REFRESH_KEY, {
        expiresIn: '30d',
      });

      return { accessToken, refreshToken };
    } catch (err) {
      throw new Error('TokenErrorGen');
    }
  };

  saveToken = async (userId: string | number, token: string) => {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: userId })
      .getOne();

    if (!user) throw new NotFoundException(`User with id #${userId} not found`);
    return await this.userRepository.update(userId, { token: token });
  };

  deleteToken = async (userId: string) => {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: userId })
      .getOne();
    if (!user) throw new NotFoundException(`User with id #${userId} not found`);
    return await this.userRepository.update(userId, { token: null });
  };

  reAuth = (refreshToken: string) => {
    try {
      const payload = verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
      ) as CreateTokenDto;

      const tokens = this.generateTokens({
        id: payload.id,
        email: payload.email,
      });

      return {
        id: payload.id,
        ...tokens,
      };
    } catch (err) {
      throw new Error('TokenErrorReAuth');
    }
  };

  existsToken = async (token: string) => {
    const userData = await this.userRepository.findOne({
      select: ['token'],
      where: {
        token: token,
      },
    });
    if (userData) return true;
    return false;
  };
}
