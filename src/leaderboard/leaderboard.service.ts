import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getTopPlayers(region?: string, sortBy = 'wn8', page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = region && region !== 'all' ? { region } : {};

    const players = await this.prisma.player.findMany({
      where,
      include: { stats: { orderBy: { recordedAt: 'desc' }, take: 1 } },
      skip,
      take: limit * 3,
    });

    const sorted = players
      .filter(p => p.stats.length > 0)
      .sort((a, b) => {
        const sa = a.stats[0];
        const sb = b.stats[0];
        if (sortBy === 'winrate') return sb.winrate - sa.winrate;
        if (sortBy === 'damage') return sb.avgDamage - sa.avgDamage;
        if (sortBy === 'battles') return sb.battles - sa.battles;
        return sb.wn8 - sa.wn8; // default wn8
      })
      .slice(0, limit);

    const total = await this.prisma.player.count({ where });

    return {
      players: sorted.map((p, i) => ({
        rank: skip + i + 1,
        ...p,
        latestStats: p.stats[0],
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getTopClans(region?: string) {
    const where = region && region !== 'all' ? { region } : {};

    const players = await this.prisma.player.findMany({
      where: { ...where, clanTag: { not: null } },
      include: { stats: { orderBy: { recordedAt: 'desc' }, take: 1 } },
    });

    const clanMap = new Map<string, { tag: string; name: string; members: number; totalWn8: number; totalWinrate: number }>();

    for (const p of players) {
      if (!p.clanTag || !p.stats[0]) continue;
      const existing = clanMap.get(p.clanTag) || { tag: p.clanTag, name: p.clanName || p.clanTag, members: 0, totalWn8: 0, totalWinrate: 0 };
      existing.members++;
      existing.totalWn8 += p.stats[0].wn8;
      existing.totalWinrate += p.stats[0].winrate;
      clanMap.set(p.clanTag, existing);
    }

    return Array.from(clanMap.values())
      .map(c => ({ ...c, avgWn8: c.totalWn8 / c.members, avgWinrate: c.totalWinrate / c.members }))
      .sort((a, b) => b.avgWn8 - a.avgWn8)
      .slice(0, 20);
  }
}
