import { BaseEntity } from 'src/core/entities/base.entity';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ActivationCodeEntity } from 'src/auth/entity/activation-code.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  firstName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  lastName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: true, unique: true })
  userName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: false, select: false })
  password: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false, unique: true })
  email: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '4000', nullable: true })
  bio: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '20', nullable: true })
  phone: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: true })
  avatar: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bool', default: false })
  isActivated: boolean;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: true })
  activationLink: string;

  @ApiProperty({ enum: UserRolesEnum, isArray: true })
  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    array: true,
    default: [UserRolesEnum.Ghost],
  })
  roles: UserRolesEnum[];

  @ApiProperty({ type: () => ActivationCodeEntity })
  @OneToOne(
    () => ActivationCodeEntity,
    (activationCode) => activationCode.user,
    { cascade: ['insert'] },
  )
  activationCode: ActivationCodeEntity;

  @BeforeInsert()
  async hashPassord() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
