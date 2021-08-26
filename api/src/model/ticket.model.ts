import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserModel } from './user.model';

@Entity({ name: 'ticket' })
export class TicketModel {
  @PrimaryColumn()
  @Generated('uuid')
  @Column({ nullable: false, type: 'uuid', primary: true })
  uid: string;

  @Column({ nullable: false, type: 'character varying' })
  code: string;

  @Column({ nullable: false, type: 'character varying' })
  title: string;

  @Column({ nullable: true, type: 'text' })
  content: string;

  @ManyToOne((type) => UserModel, (creator) => creator.uid)
  @Column({ nullable: false, type: 'uuid' })
  creator: string;

  @Column({ nullable: false, type: 'uuid' })
  status: string;

  @CreateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  created_at: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp without time zone' })
  deleted_at: Date;
}
