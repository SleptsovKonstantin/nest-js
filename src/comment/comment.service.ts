import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { newCommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(newCommentEntity)
    private repository: Repository<newCommentEntity>,
  ) {}

  create(dto: CreateCommentDto) {
    return this.repository.save({
      text: dto.text,
      post: { id: dto.postId },
    });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const firstComment = await this.repository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: id })
      .getOne();

    if (!firstComment)
      throw new NotFoundException(`User with id #${id} not found`);

    return firstComment;
  }

  async update(id: number, _updateCommentDto: UpdateCommentDto) {
    const firstComment = await this.repository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: id })
      .getOne();

    if (!firstComment)
      throw new NotFoundException(`User with id #${id} not found`);

    return this.repository.update(id, _updateCommentDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
