import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from 'src/modules/auth.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, Authorization]
})
export class PostsModule {}
