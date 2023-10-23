import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionSetViewCount } from './question-set-view-count';
import { User } from './user.entity';

interface QuestionList {
  questions: string[];
}

@Entity()
export class QuestionSet {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int')
  userId: number;

  @Column('varchar')
  title: string;

  @Column('json')
  questions: QuestionList;

  @Column('boolean')
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.QuestionSets, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => QuestionSetViewCount, (qsvc) => qsvc.questionSet, {
    lazy: true,
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'questionSetId' }])
  questionSetViewCounts: QuestionSetViewCount[];
}
