// import { Response } from 'express';

import {
  Controller,
  Post,
  UseGuards,
  // Request,
  // Response,
  Get,
  Body,
  Req,
  Res,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserService } from 'src/user/user.service';

interface RequestNew extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: RequestNew, @Res() res: Response) {
    return this.authService.logout(req.user.id, res);
  }

  @Post('reAuth')
  reAuth(@Req() req: Request, @Res() res: Response) {
    return this.authService.reAuth(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
