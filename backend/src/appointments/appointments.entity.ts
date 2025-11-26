import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  appointmentDateTime: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  googleEventId: string;

  @CreateDateColumn()
  createdAt: Date;
}