import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/auth.dto';
import type { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import type { RequestSession } from './guards/auth.guard';
import { Auth } from './guards/auth.decorator';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(body.login, body.password);

    res.cookie('sessionId', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false,
    });
    return { status: 'Success' };
  }

  @Get('/me')
  @Auth()
  async verify(@Req() request: RequestSession) {
    return request.session.user;
  }
}
