import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MetaService } from './meta.service';
import { OptionalJwtGuard } from '../common/guards/optional-jwt.guard';

@Controller('meta')
@UseGuards(OptionalJwtGuard)
export class MetaController {
  constructor(private metaService: MetaService) {}

  @Get()
  async index(@Query('type') type: string, @Req() req: Request, @Res() res: Response) {
    const stats = await this.metaService.getMetaStats(type);
    const topTanks = stats.slice(0, 8);
    const chartData = JSON.stringify(stats.map(s => ({
      name: s.entityName,
      winrate: s.winrate,
      popularity: s.popularity,
      avgDamage: s.avgDamage,
    })));

    return res.render('meta/index', {
      title: 'Мета-статистика — GameStat',
      user: req['user'],
      stats,
      topTanks,
      chartData,
      type: type || 'all',
    });
  }
}
