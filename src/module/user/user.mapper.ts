import type {
  UserDetailResponse,
  UserResponse,
  UserWithPassword,
} from './types/user-response.type';
import type { UserEntity } from './types/user.type';

function toUserResponse(user: UserEntity): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function toUserDetailResponse(user: UserEntity): UserDetailResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toUserWithPassword(user: UserEntity): UserWithPassword {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userMapper = {
  toUserResponse,
  toUserDetailResponse,
  toUserWithPassword,
};
