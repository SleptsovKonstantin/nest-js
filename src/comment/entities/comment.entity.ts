import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('comments')
export class newCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { nullable: true })
  @JoinColumn({ name: 'postId' })
  post: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
