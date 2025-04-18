import { DATABASE_NAME } from 'src/common/const/database-name';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { CommentEntity } from 'src/modules/comment/entities/comment.entity';
import { UserEntity } from 'src/modules/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: DATABASE_NAME.BLOG })
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'text' })
  text: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.blogs)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.blogs)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];
}
