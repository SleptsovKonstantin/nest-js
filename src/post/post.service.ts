import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto) {
    return this.postRepository.save(dto);
  }

  findAll() {
    return this.postRepository.find();
  }

  async findOne(id: number) {
    const firstPost = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: id })
      .getOne();

    if (!firstPost)
      throw new NotFoundException(`User with id #${id} not found`);

    return firstPost;
  }

  async update(id: number, _updatePostDto: UpdatePostDto) {
    const firstPost = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: id })
      .getOne();

    if (!firstPost)
      throw new NotFoundException(`User with id #${id} not found`);

    return this.postRepository.update(id, _updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
