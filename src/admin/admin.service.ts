import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, players, matches, logs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.player.count(),
      this.prisma.match.count(),
      this.prisma.activityLog.count(),
    ]);
    return { users, players, matches, logs };
  }

  async getLogs(page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.activityLog.count(),
    ]);
    return { logs, total, page, pages: Math.ceil(total / limit) };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(id: number, role: any) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async deleteUser(id: number) {
    await this.prisma.activityLog.create({ data: { action: 'DELETE_USER', entity: 'User', entityId: String(id) } });
    return this.prisma.user.delete({ where: { id } });
  }

  async getPlayers(page = 1) {
    const skip = (page - 1) * 20;
    const [players, total] = await Promise.all([
      this.prisma.player.findMany({ skip, take: 20, include: { stats: { take: 1, orderBy: { recordedAt: 'desc' } } }, orderBy: { updatedAt: 'desc' } }),
      this.prisma.player.count(),
    ]);
    return { players, total, page, pages: Math.ceil(total / 20) };
  }

  async deletePlayer(id: number) {
    await this.prisma.activityLog.create({ data: { action: 'DELETE_PLAYER', entity: 'Player', entityId: String(id) } });
    return this.prisma.player.delete({ where: { id } });
  }

  async getMetaStats() {
    return this.prisma.metaStat.findMany({ orderBy: { winrate: 'desc' } });
  }

  async createMetaStat(data: any) {
    await this.prisma.activityLog.create({ data: { action: 'CREATE_META', entity: 'MetaStat', details: data.entityName } });
    return this.prisma.metaStat.create({ data });
  }

  async updateMetaStat(id: number, data: any) {
    await this.prisma.activityLog.create({ data: { action: 'UPDATE_META', entity: 'MetaStat', entityId: String(id) } });
    return this.prisma.metaStat.update({ where: { id }, data });
  }

  async deleteMetaStat(id: number) {
    await this.prisma.activityLog.create({ data: { action: 'DELETE_META', entity: 'MetaStat', entityId: String(id) } });
    return this.prisma.metaStat.delete({ where: { id } });
  }
}
