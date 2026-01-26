import type { UserEntity } from './types/user.type';
import type { UserDetailResponse, UserResponse } from './types/user-response.type';

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

export const userMapper = {
  toUserResponse,
  toUserDetailResponse,
};
