import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserModel {
  @PrimaryColumn()
  @Generated('uuid')
  @Column({ nullable: false, type: 'uuid', primary: true })
  uid: string;

  @Column({ nullable: false, type: 'character varying' })
  email: string;

  @Column({ nullable: false, type: 'character varying' })
  full_name: string;

  @Column({ nullable: false, type: 'character varying' })
  password: string;

  @CreateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  created_at: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp without time zone' })
  deleted_at: Date;
}
