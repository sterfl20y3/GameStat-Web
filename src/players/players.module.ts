import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { WargamingService } from './wargaming.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PlayersController],
  providers: [PlayersService, WargamingService],
  exports: [PlayersService],
})
export class PlayersModule {}
