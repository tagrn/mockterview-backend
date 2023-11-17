import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { QuestionSet } from './question-set.entity';

@Entity()
export class QuestionSetViewCount {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  questionSetId: number;

  @Column('int')
  count: number;

  @ManyToOne(() => User, (user) => user.questionSetViewCounts, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => QuestionSet, (qs) => qs.questionSetViewCounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'questionSetId', referencedColumnName: 'id' })
  questionSet: QuestionSet;
}
