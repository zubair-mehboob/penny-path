import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ nullable: true })
  note?: string;
}
