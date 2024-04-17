import {
  BeforeInsert,
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({select:false})
  password: string;

  @Column({ type: 'timestamp', default: () => new Date() })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;
  
  @BeforeInsert()
  async hashUserPassword() {
    // Perform actions before inserting the entity
    this.password = await bcrypt.hash(this.password, 10);
  }
}
