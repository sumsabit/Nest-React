import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { ChatHistory } from 'src/history/history.entity';

export enum FeedbackType {
  HELPFUL = 'helpful',
  NOT_HELPFUL = 'not_helpful',
  WRONG_INTERPRETATION = 'wrong_interpretation',
  HUMAN_REVIEW = 'human_review',
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;

  @ManyToOne(() => ChatHistory, (chat) => chat.feedbacks)
  chat: ChatHistory;

  @Column({
    type: 'enum',
    enum: FeedbackType,
  })
  type: FeedbackType;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: false })
  reviewed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
