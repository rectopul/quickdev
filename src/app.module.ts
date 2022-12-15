import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [UsersModule, AuthenticateModule, PostsModule, CommentsModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
