import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  capacity: number;

  @Column()
  available: boolean;

  @Column()
  date: string;
}
