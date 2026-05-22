import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { OptionalJwtGuard } from '../common/guards/optional-jwt.guard';

@Controller('leaderboard')
@UseGuards(OptionalJwtGuard)
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async index(
    @Query('region') region: string,
    @Query('sort') sort = 'wn8',
    @Query('page') page = '1',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.leaderboardService.getTopPlayers(region, sort, +page);
    const clans = await this.leaderboardService.getTopClans(region);

    return res.render('leaderboard/index', {
      title: 'Лідерборд — GameStat',
      user: req['user'],
      ...result,
      clans,
      region: region || 'all',
      sort,
    });
  }
}
