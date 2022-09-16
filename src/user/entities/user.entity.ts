import { BaseEntity } from 'src/core/entities/base.entity';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '200', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: '200', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: '2000', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: '200', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: '4000', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: '2000', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    default: UserRolesEnum.Ghost,
  })
  role: UserRolesEnum;
}
