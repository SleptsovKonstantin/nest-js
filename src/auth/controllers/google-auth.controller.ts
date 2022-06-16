/* eslint-disable @typescript-eslint/no-empty-function */
import { Response } from 'express';

import { Controller, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';

interface RequestNew extends Request {
  user: {
    id: string;
    email: string;
    fullName: string;
    // email: string;
    // firstName: string;
    // lastName: string;
    // avatar: string;
  };
}

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: RequestNew, @Res() res: Response) {
    return await this.googleAuthService.googleLogin(req.user, res);
  }
}
