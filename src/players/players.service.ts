import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WargamingService } from './wargaming.service';

@Injectable()
export class PlayersService {
  constructor(
    private prisma: PrismaService,
    private wargaming: WargamingService,
  ) {}

  async search(nickname: string, region = 'eu') {
    // Check cache
    const cached = await this.prisma.player.findFirst({
      where: { nickname: { equals: nickname, mode: 'insensitive' }, region },
      include: { stats: { orderBy: { recordedAt: 'desc' }, take: 1 }, matches: { orderBy: { playedAt: 'desc' }, take: 10 } },
    });

    if (cached) {
      const age = Date.now() - new Date(cached.updatedAt).getTime();
      if (age < 3600000) return cached;
    }

    const apiData = await this.wargaming.searchPlayer(nickname, region);
    if (!apiData) {
      if (cached) return cached;
      return null;
    }

    const player = await this.prisma.player.upsert({
      where: { nickname: apiData.nickname },
      create: { nickname: apiData.nickname, accountId: apiData.accountId, region: apiData.region },
      update: { accountId: apiData.accountId, updatedAt: new Date() },
    });

    await this.prisma.stats.create({
      data: {
        playerId: player.id,
        battles: apiData.battles,
        wins: apiData.wins,
        losses: apiData.losses,
        winrate: apiData.winrate,
        avgDamage: apiData.avgDamage,
        avgXp: apiData.avgXp,
        wn8: apiData.wn8,
        kills: apiData.kills,
        survivalRate: apiData.survivalRate,
      },
    });

    await this.prisma.activityLog.create({
      data: { action: 'SEARCH', entity: 'Player', entityId: String(player.id), details: nickname },
    });

    return this.findById(player.id);
  }

  async findById(id: number) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        stats: { orderBy: { recordedAt: 'desc' }, take: 30 },
        matches: { orderBy: { playedAt: 'desc' }, take: 20 },
      },
    });
    if (!player) throw new NotFoundException('Гравця не знайдено');
    return player;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [players, total] = await Promise.all([
      this.prisma.player.findMany({
        skip, take: limit,
        include: { stats: { orderBy: { recordedAt: 'desc' }, take: 1 } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.player.count(),
    ]);
    return { players, total, page, pages: Math.ceil(total / limit) };
  }

  async delete(id: number) {
    return this.prisma.player.delete({ where: { id } });
  }

  async getChartData(playerId: number) {
    const stats = await this.prisma.stats.findMany({
      where: { playerId },
      orderBy: { recordedAt: 'asc' },
      take: 30,
    });
    return stats.map(s => ({
      date: s.recordedAt,
      winrate: s.winrate,
      avgDamage: s.avgDamage,
      wn8: s.wn8,
      battles: s.battles,
    }));
  }
}
