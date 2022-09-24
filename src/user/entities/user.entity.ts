import { BaseEntity } from 'src/core/entities/base.entity';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '200', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: '200', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: '2000', nullable: true, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: '2000', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: '200', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: '4000', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: '20', nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: '2000', nullable: true })
  avatar: string;

  @Column({ type: 'bool', default: false })
  isActivated: boolean;

  @Column({ type: 'varchar', length: '2000', nullable: true })
  activationLink: string;

  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    default: UserRolesEnum.Ghost,
  })
  role: UserRolesEnum;

  @BeforeInsert()
  async hashPassord() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
