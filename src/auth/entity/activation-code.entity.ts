import { BaseEntity } from 'src/core/entities/base.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('activation_codes')
export class ActivationCodeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '10' })
  code: string;

  @OneToOne(() => UserEntity, (user) => user.activationCode, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
