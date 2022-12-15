import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Authorization } from 'src/modules/auth.service';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, Authorization, PrismaService]
})
export class CommentsModule {}
