import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Bookmark } from 'src/book-mark/bookmark.entity';
import { Feedback } from 'src/feedback/ feedback.entity';

@Entity()
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('text')
  answer: string;

 // src/history/history.entity.ts
@ManyToOne(() => User, (user) => user.histories)
user: User;
  
  @OneToMany(() => Bookmark, (bookmark) => bookmark.history)
  bookmarks: Bookmark[];
  

@OneToMany(() => Feedback, (feedback) => feedback.chat)
feedbacks: Feedback[];
}

