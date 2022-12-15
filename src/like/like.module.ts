import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from 'src/modules/auth.service';

@Module({
  controllers: [LikeController],
  providers: [LikeService, PrismaService, Authorization]
})
export class LikeModule {}
