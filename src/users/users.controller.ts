import { Controller, Get, Post, Param, Req, Res, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersService.findById((req['user'] as any).id);
    return res.render('dashboard/index', {
      title: 'Особистий кабінет — GameStat',
      user,
      favorites: user.favorites,
      history: user.history,
    });
  }

  @Post('favorite/:playerId')
  async addFavorite(@Param('playerId', ParseIntPipe) playerId: number, @Req() req: Request, @Res() res: Response) {
    await this.usersService.addFavorite((req['user'] as any).id, playerId);
    return res.redirect('back');
  }

  @Post('unfavorite/:playerId')
  async removeFavorite(@Param('playerId', ParseIntPipe) playerId: number, @Req() req: Request, @Res() res: Response) {
    await this.usersService.removeFavorite((req['user'] as any).id, playerId);
    return res.redirect('back');
  }
}
