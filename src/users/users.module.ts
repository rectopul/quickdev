import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from 'src/modules/auth.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, Authorization]
})
export class UsersModule {}
