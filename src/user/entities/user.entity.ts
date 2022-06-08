import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // 'uuid'

  @Column()
  fullName: string;

  @Column()
  email: string;
  // { unique: true }

  @Column({ nullable: true })
  password?: string;
}
