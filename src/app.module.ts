import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlayersModule } from './players/players.module';
import { StatsModule } from './stats/stats.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MetaModule } from './meta/meta.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    PlayersModule,
    StatsModule,
    LeaderboardModule,
    MetaModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
