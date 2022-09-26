import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: '200', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: '4000', default: '' })
  description: string;

  @Column({ type: 'varchar', default: '' })
  image: string;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @Column({ type: 'int', default: 0 })
  favoritesCount: number;

  @Column({ type: 'boolean', default: false })
  isBlock: boolean;
}
