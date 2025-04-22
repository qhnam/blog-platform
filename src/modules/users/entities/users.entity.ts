import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { CommentEntity } from 'src/modules/comment/entities/comment.entity';
import { USER_STATUS } from '../enums/user-status.enum';

@Entity({ name: DATABASE_NAME.USER })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password' })
  @Exclude()
  password: string;

  @Column({ name: 'fullname' })
  fullname: string;

  @Column({ name: 'status' })
  status: USER_STATUS;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BlogEntity, (blog) => blog.user)
  blogs: BlogEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
