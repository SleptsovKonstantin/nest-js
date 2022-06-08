// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { PostModule } from './post/post.module';
import { PostEntity } from './post/entities/post.entity';
import { CommentModule } from './comment/comment.module';
import { newCommentEntity } from './comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE,
      entities: [UserEntity, PostEntity, newCommentEntity],
      synchronize: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
