import { UserEntity } from 'src/user/entity/user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
