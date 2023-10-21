import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int')
  userId: number;

  @Column('varchar')
  questionSetTitle: string;

  @Column('varchar')
  question: string;

  @Column('varchar')
  fileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.videos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
