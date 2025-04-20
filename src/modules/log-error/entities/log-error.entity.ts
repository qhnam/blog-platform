import { DATABASE_NAME } from 'src/common/const/database-name';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(DATABASE_NAME.LOG_ERRORS)
export class LogErrorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'error_code' })
  errorCode: string;

  @Column({ name: 'message' })
  message: string;

  @Column({ name: 'stack_trade', type: 'text' })
  stackTrade: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'path', nullable: true })
  path?: string;

  @Column({ name: 'method', nullable: true })
  method?: string;
}
