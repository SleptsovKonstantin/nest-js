import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (user) throw new ConflictException(`this email already taken`);

    const saltRound = process.env.SALT_ROUNDS;
    const { password, ...other } = dto;
    const hash = await bcrypt.hash(password, saltRound);
    const newUser = {
      password: hash,
      ...other,
    };
    console.log(newUser);
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findById(id: string | number) {
    const logtUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: +id })
      .getOne();

    if (!logtUser) throw new NotFoundException(`User with id #${id} not found`);

    return logtUser;
  }

  findByCound(cond: LoginUserDto) {
    return this.usersRepository.findOneBy(cond);
  }

  async update(id: string, _updateUserDto: UpdateUserDto) {
    await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();

    return this.usersRepository.update(id, _updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
