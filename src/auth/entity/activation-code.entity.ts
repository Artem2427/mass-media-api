import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('activation_codes')
export class ActivationCodeEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '10' })
  code: string;

  @ApiPropertyOptional({ type: () => UserEntity })
  @OneToOne(() => UserEntity, (user) => user.activationCode, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
