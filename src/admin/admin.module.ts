import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [UsersModule, MetaModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
