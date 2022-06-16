import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';

import { Request, Response } from 'express';
// import { hash, compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByCound({
      email,
      password,
    });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateJwtToken(data: { id: string; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    const { password, ...userData } = user;
    return {
      ...userData,
      access_token: this.generateJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      console.log('kjshfkjgdskjf');

      const { password, ...newUser } = await this.userService.create(dto);
      console.log(newUser);
      console.log(password);
      return {
        ...newUser,
        access_token: this.generateJwtToken(newUser),
      };
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async logout(userId: string, res: Response) {
    try {
      await this.tokenService.deleteToken(userId);
      res.clearCookie('refreshToken');
      return res.send({ message: 'Logout' });
    } catch (err) {
      return res.send({ message: err.message });
    }
  }

  async reAuth(req: Request, res: Response) {
    try {
      const cookie = this.cookieInObject(req.headers.cookie);
      const token = cookie.refreshToken;

      const { id, accessToken, refreshToken } = this.tokenService.reAuth(token);

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await this.tokenService.saveToken(id, refreshToken);

      return res.send({ accessToken });
    } catch (err) {
      return res.send({ message: err.message });
    }
  }

  async authGoogle(token: string, res: Response) {
    try {
      const check = await this.tokenService.existsToken(token);

      if (!check) throw new Error('TokenNotExists');

      const { id, accessToken, refreshToken } = this.tokenService.reAuth(token);

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await this.tokenService.saveToken(id, refreshToken);

      const user = await this.userService.findById(id);

      return res.send({
        id: `${user.id}`,
        fullName: user.fullName,
        email: user.email,
        // avatar: user.avatarURL,
        // status: user.status,
        accessToken,
      });
    } catch (err) {
      return res.send({ message: err.message });
    }
  }

  private cookieInObject(cookie: string | undefined) {
    if (!cookie) return undefined;
    return cookie
      .split(';')
      .map((item: string) => item.split('='))
      .reduce((acc: { [key: string]: string }, item: string[]) => {
        acc[decodeURIComponent(item[0].trim())] = decodeURIComponent(
          item[1].trim(),
        );
        return acc;
      }, {});
  }
}
