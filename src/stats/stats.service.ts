import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [totalPlayers, totalBattles, avgWinrate] = await Promise.all([
      this.prisma.player.count(),
      this.prisma.stats.aggregate({ _sum: { battles: true } }),
      this.prisma.stats.aggregate({ _avg: { winrate: true } }),
    ]);

    return {
      totalPlayers,
      totalBattles: totalBattles._sum.battles || 0,
      avgWinrate: avgWinrate._avg.winrate?.toFixed(1) || 0,
    };
  }
}
