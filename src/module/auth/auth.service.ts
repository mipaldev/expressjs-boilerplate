import { UnauthorizedException } from '@/shared/exceptions/unauthorized.exception';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { passwordUtil } from '@/shared/utils/password.util';
import { userMapper } from '@/module/user/user.mapper';
import { userRepository } from '@/module/user/user.repository';
import { userService } from '@/module/user/user.service';
import type { RegisterInput } from './schemas/register.schema';
import type { LoginInput } from './schemas/login.schema';
import type { LoginResponse } from './types/auth-response.type';
import type { UserDetailResponse, UserResponse } from '@/module/user/types/user-response.type';
import type { JwtPayload } from '@/shared/types/jwt-payload.type';
import { UserEntity } from '../user/types/user.type';

async function register(input: RegisterInput): Promise<UserResponse> {
  return userService.create(input);
}

async function login(input: LoginInput): Promise<LoginResponse> {
  const user = await userRepository.findByEmail(input.email);
  if (!user) throw new UnauthorizedException('Invalid email or password');

  const passwordMatch = await passwordUtil.verify(user.password, input.password);
  if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');

  const payload: JwtPayload = { sub: user.id, email: user.email };
  const accessToken = jwtUtil.sign(payload);

  return {
    accessToken,
    user: userMapper.toUserDetailResponse(user),
  };
}

async function me(userId: UserEntity['id']): Promise<UserDetailResponse> {
  return userService.getById(userId);
}

export const authService = {
  register,
  login,
  me,
};
