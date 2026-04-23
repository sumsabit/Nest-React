import { Bookmark } from 'src/book-mark/bookmark.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatHistory } from 'src/history/history.entity';
import { Exclude } from 'class-transformer';
import { Feedback } from 'src/feedback/ feedback.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Exclude()
  @Column()
  password: string;
  
 @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'text', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @Column({ type: 'varchar', nullable: false, default: 'Unknown' })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => ChatHistory, (history) => history.user)
  histories: ChatHistory[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}