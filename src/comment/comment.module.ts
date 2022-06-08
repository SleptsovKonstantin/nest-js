import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newCommentEntity } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([newCommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
