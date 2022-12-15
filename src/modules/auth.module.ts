import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from './auth.service';

@Module({
  controllers: [],
  providers: [Authorization, PrismaService]
})
export class PostsModule {}
