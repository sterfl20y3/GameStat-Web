import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  loginPage(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.['token'];
    if (token && this.authService.verifyToken(token)) {
      return res.redirect('/');
    }
    return res.render('auth/login', { title: 'Вхід — GameStat', error: req.query['error'] });
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      const token = await this.authService.login(user);
      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
      return res.redirect('/');
    } catch (e) {
      return res.redirect('/auth/login?error=' + encodeURIComponent(e.message));
    }
  }

  @Get('register')
  registerPage(@Res() res: Response) {
    return res.render('auth/register', { title: 'Реєстрація — GameStat' });
  }

  @Post('register')
  async register(@Body() body: any, @Res() res: Response) {
    try {
      await this.authService.register({
        username: body.username,
        email: body.email,
        password: body.password,
      });
      const user = await this.authService.validateUser(body.email, body.password);
      const token = await this.authService.login(user);
      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
      return res.redirect('/');
    } catch (e) {
      return res.render('auth/register', {
        title: 'Реєстрація — GameStat',
        error: e.message,
        body,
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.redirect('/');
  }

  @Get('logout')
  logoutGet(@Res() res: Response) {
    res.clearCookie('token');
    return res.redirect('/');
  }
}
