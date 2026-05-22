import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from './prisma/prisma.service';
import { OptionalJwtGuard } from './common/guards/optional-jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(OptionalJwtGuard)
  @Get()
  async home(@Req() req: Request, @Res() res: Response) {
    const topPlayers = await this.prisma.player.findMany({
      take: 5,
      include: { stats: { orderBy: { recordedAt: 'desc' }, take: 1 } },
      orderBy: { stats: { _count: 'desc' } },
    });

    const totalPlayers = await this.prisma.player.count();
    const totalUsers = await this.prisma.user.count();
    const totalMatches = await this.prisma.match.count();

    const topMeta = await this.prisma.metaStat.findMany({
      take: 3,
      orderBy: { winrate: 'desc' },
    });

    return res.render('home', {
      title: 'GameStat — Аналітика ігрової статистики',
      user: req['user'],
      topPlayers: topPlayers.map(p => ({
        ...p,
        latestStats: p.stats[0] || null,
      })),
      stats: { totalPlayers, totalUsers, totalMatches },
      topMeta,
    });
  }
}
