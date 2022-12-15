import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'cities' })
export class CityEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: '200', nullable: false })
  name: string;

  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: '200', nullable: false })
  area: string;

  @ApiProperty({ type: String, maxLength: 2000 })
  @Column({ type: 'varchar', length: '2000', nullable: true })
  description: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bool', default: false })
  isRegionalCenter: boolean;

  @ApiProperty({ type: () => [UserEntity] })
  @OneToMany(() => UserEntity, (user) => user.city)
  users: UserEntity[];
}
