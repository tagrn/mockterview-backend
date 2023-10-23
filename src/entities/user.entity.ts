import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../user/enums/user-role.enum';
import { QuestionSetViewCount } from './question-set-view-count';
import { QuestionSet } from './question-set.entity';
import { Video } from './video';

@Index('email', ['email'], { unique: true })
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 50 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 12, default: '초보 면접자' })
  nickname: string;

  @Column('varchar', { length: 8, default: 'GENERAL' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => QuestionSet, (qs) => qs.user, { lazy: true })
  @JoinColumn([{ name: 'id', referencedColumnName: 'userId' }])
  QuestionSets: QuestionSet[];

  @OneToMany(() => QuestionSetViewCount, (qsvc) => qsvc.user, { lazy: true })
  @JoinColumn([{ name: 'id', referencedColumnName: 'userId' }])
  questionSetViewCounts: QuestionSetViewCount[];

  @OneToMany(() => Video, (video) => video.user, {
    lazy: true,
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'userId' }])
  videos: Video[];
}
