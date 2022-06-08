import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.save(dto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const firstUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();

    if (!firstUser)
      throw new NotFoundException(`User with id #${id} not found`);

    return firstUser;
  }

  async update(id: number, _updateUserDto: UpdateUserDto) {
    await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();

    return this.usersRepository.update(id, _updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
