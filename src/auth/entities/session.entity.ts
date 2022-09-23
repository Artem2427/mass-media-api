import { BaseEntity } from 'src/core/entities/base.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'sessions' })
export class SessionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '2000', nullable: false })
  refreshToken;

  @OneToOne(() => UserEntity, (user) => user.session, { cascade: true })
  @JoinColumn()
  user: UserEntity;
}
