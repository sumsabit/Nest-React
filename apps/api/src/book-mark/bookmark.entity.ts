import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { ChatHistory } from 'src/history/history.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ChatHistory, history => history.bookmarks, { onDelete: 'CASCADE' })
  history: ChatHistory;

  @CreateDateColumn()
  createdAt: Date;
}