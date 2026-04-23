import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type LawStatus = 'draft' | 'published' | 'archived';

@Entity('law')
export class Law {
  @PrimaryGeneratedColumn('uuid')
  id: string;
@Column({
  type: 'varchar',
  default: 'draft',
})
status: string;
  @Column()
  article_number: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @Column({ nullable: true, type: 'text' })
  simple_explanation: string;

  @Column()
  language: string;

  @CreateDateColumn()
  created_at: Date;

  
}
