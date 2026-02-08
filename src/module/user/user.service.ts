import { ConflictException } from '@/shared/exceptions/conflict.exception';
import { NotFoundException } from '@/shared/exceptions/not-found.exception';
import type { PagedResult } from '@/shared/types/pagination.type';
import { passwordUtil } from '@/shared/utils/password.util';
import type { CreateUserInput } from './schemas/create-user.schema';
import type { QueryUserInput } from './schemas/query-user.schema';
import type { UpdateUserInput } from './schemas/update-user.schema';
import { userMapper } from './user.mapper';
import { userRepository } from './user.repository';
import type {
  UserDetailResponse,
  UserResponse,
  UserWithPassword,
} from './types/user-response.type';
import type { UserEntity } from './types/user.type';

async function create(input: CreateUserInput): Promise<UserResponse> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) throw new ConflictException('Email already registered');

  const user = await userRepository.create({
    ...input,
    password: await passwordUtil.hash(input.password),
  });

  return userMapper.toUserResponse(user);
}

async function getAll(query: QueryUserInput): Promise<PagedResult<UserDetailResponse>> {
  const result = await userRepository.findAll(query);
  return {
    data: result.data.map(userMapper.toUserDetailResponse),
    meta: result.meta,
  };
}

async function getById(id: UserEntity['id']): Promise<UserDetailResponse> {
  const user = await userRepository.findById(id);
  if (!user) throw new NotFoundException('User not found');
  return userMapper.toUserDetailResponse(user);
}

async function getByEmail(email: UserEntity['email']): Promise<UserWithPassword> {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new NotFoundException('User not found');
  return userMapper.toUserWithPassword(user);
}

async function update(id: UserEntity['id'], input: UpdateUserInput): Promise<UserDetailResponse> {
  const existing = await userRepository.findById(id);
  if (!existing) throw new NotFoundException('User not found');

  if (input.email && input.email !== existing.email) {
    const emailTaken = await userRepository.findByEmail(input.email);
    if (emailTaken) throw new ConflictException('Email already in use');
  }

  const data: UpdateUserInput = { ...input };
  if (input.password) {
    data.password = await passwordUtil.hash(input.password);
  }

  const updated = await userRepository.updateById(id, data);
  if (!updated) throw new NotFoundException('User not found');

  return userMapper.toUserDetailResponse(updated);
}

async function remove(id: UserEntity['id']): Promise<UserResponse> {
  const deleted = await userRepository.deleteById(id);
  if (!deleted) throw new NotFoundException('User not found');
  return userMapper.toUserResponse(deleted);
}

export const userService = {
  create,
  getAll,
  getById,
  getByEmail,
  update,
  remove,
};
