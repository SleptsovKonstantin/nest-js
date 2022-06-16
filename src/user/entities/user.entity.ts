import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  token: string;

  @Column({ default: 'offline' })
  status: string;

  @Column({ default: 'defaultAvatar.png' })
  avatarURL: string;

  // @OneToMany(() => MessageEntity, (message) => message.user)
  // messages: MessageEntity[];

  // @OneToMany(() => RoomEntity, (room) => room.owner)
  // owningRooms: RoomEntity[];

  // @ManyToMany(() => RoomEntity, (room) => room.members, { onUpdate: 'CASCADE' })
  // @JoinTable({ name: 'room-members' })
  // rooms: RoomEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
