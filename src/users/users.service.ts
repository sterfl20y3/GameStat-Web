import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        favorites: { include: { player: { include: { stats: { take: 1, orderBy: { recordedAt: 'desc' } } } } } },
        history: { include: { player: true }, orderBy: { viewedAt: 'desc' }, take: 10 },
      },
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });
  }

  async updateRole(id: number, role: 'USER' | 'ADMIN') {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async addFavorite(userId: number, playerId: number) {
    return this.prisma.favorite.upsert({
      where: { userId_playerId: { userId, playerId } },
      create: { userId, playerId },
      update: {},
    });
  }

  async removeFavorite(userId: number, playerId: number) {
    return this.prisma.favorite.deleteMany({ where: { userId, playerId } });
  }

  async addHistory(userId: number, playerId: number) {
    return this.prisma.viewHistory.create({ data: { userId, playerId } });
  }
}
