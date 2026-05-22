import { Controller, Get, Post, Query, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { PlayersService } from './players.service';
import { UsersService } from '../users/users.service';
import { OptionalJwtGuard } from '../common/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('players')
export class PlayersController {
  constructor(
    private playersService: PlayersService,
    private usersService: UsersService,
  ) {}

  @UseGuards(OptionalJwtGuard)
  @Get('search')
  async search(@Query('q') q: string, @Query('region') region = 'eu', @Req() req: Request, @Res() res: Response) {
    if (!q) return res.redirect('/');

    const player = await this.playersService.search(q, region);
    if (!player) {
      return res.render('players/not-found', {
        title: 'Гравця не знайдено',
        user: req['user'],
        query: q,
      });
    }

    if (req['user']) {
      await this.usersService.addHistory((req['user'] as any).id, player.id);
    }

    return res.redirect(`/players/${player.id}`);
  }

  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  async profile(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Res() res: Response) {
    const player = await this.playersService.findById(id);
    const latestStats = player.stats[0] || null;
    const chartData = await this.playersService.getChartData(id);

    let isFavorite = false;
    if (req['user']) {
      const user = await this.usersService.findById((req['user'] as any).id);
      isFavorite = user.favorites.some((f: any) => f.playerId === id);
      await this.usersService.addHistory((req['user'] as any).id, id);
    }

    return res.render('players/profile', {
      title: `${player.nickname} — GameStat`,
      user: req['user'],
      player,
      latestStats,
      matches: player.matches,
      chartData: JSON.stringify(chartData),
      isFavorite,
    });
  }

  @UseGuards(OptionalJwtGuard)
  @Get()
  async list(@Query('page') page = '1', @Req() req: Request, @Res() res: Response) {
    const result = await this.playersService.findAll(+page);
    return res.render('players/list', {
      title: 'Всі гравці — GameStat',
      user: req['user'],
      ...result,
    });
  }
}
