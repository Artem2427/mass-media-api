import { BaseEntity } from 'src/core/entities/base.entity';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ActivationCodeEntity } from 'src/auth/entity/activation-code.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleEntity } from 'src/article/entity/article.entity';
import { CityEntity } from 'src/city/entity/city.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  firstName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: false })
  lastName: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '200', nullable: true, unique: true })
  userName: string;

  @ApiProperty({ type: String, writeOnly: true })
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
  @Column({ type: 'varchar', length: '2000', nullable: false })
  forgotPasswordLink: string;

  @ApiProperty({ enum: UserRolesEnum, isArray: true })
  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    array: true,
    default: [UserRolesEnum.Ghost],
  })
  roles: UserRolesEnum[];

  @ApiProperty({ type: Number, nullable: true, maximum: 5 })
  @Column({
    type: 'float',
    nullable: true,
  })
  rating: number;

  @ApiProperty({ type: [String], isArray: true })
  @Column({ type: 'varchar', array: true })
  searchHistory: string[];

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bool', default: false })
  isSubscribe: boolean;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', nullable: true })
  dataOfBorn: Date;

  @ApiPropertyOptional({ type: () => ActivationCodeEntity, example: {} })
  @OneToOne(
    () => ActivationCodeEntity,
    (activationCode) => activationCode.user,
    { cascade: ['insert', 'update'] },
  )
  activationCode: ActivationCodeEntity;

  @ApiProperty({ type: () => [ArticleEntity] })
  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ApiProperty({ type: () => CityEntity })
  @ManyToOne(() => CityEntity, (cities) => cities.users, {
    onDelete: 'CASCADE',
  })
  city: CityEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
