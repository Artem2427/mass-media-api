import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: '200', nullable: false })
  title: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', nullable: false })
  slug: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '4000', nullable: true })
  description: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'int', default: 0 })
  favoritesCount: number;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: false })
  isBlock: boolean;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.articles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  author: UserEntity;
}
