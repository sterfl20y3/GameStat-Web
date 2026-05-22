import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(private prisma: PrismaService) {}

  async getMetaStats(type?: string) {
    const where = type && type !== 'all' ? { entityType: type } : {};
    return this.prisma.metaStat.findMany({
      where,
      orderBy: { winrate: 'desc' },
    });
  }

  async create(data: { entityName: string; entityType: string; winrate: number; popularity: number; avgDamage: number; region: string }) {
    return this.prisma.metaStat.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.metaStat.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.metaStat.delete({ where: { id } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateMetaStats() {
    this.logger.log('Running daily meta stats update...');
    const stats = await this.prisma.metaStat.findMany();
    for (const stat of stats) {
      const fluctuation = (Math.random() - 0.5) * 2;
      await this.prisma.metaStat.update({
        where: { id: stat.id },
        data: { winrate: Math.max(40, Math.min(70, stat.winrate + fluctuation)) },
      });
    }
    this.logger.log('Meta stats updated');
  }
}
