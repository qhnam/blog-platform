import { DATABASE_NAME } from 'src/common/const/database-name';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: DATABASE_NAME.CATEGORY })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'slug' })
  slug: string;

  @OneToMany(() => BlogEntity, (blog) => blog.category)
  blogs: BlogEntity[];
}
