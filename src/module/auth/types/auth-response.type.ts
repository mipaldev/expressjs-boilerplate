import type { UserDetailResponse } from '@/module/user/types/user-response.type';

export type TokenResponse = {
  accessToken: string;
};

export type LoginResponse = TokenResponse & {
  user: UserDetailResponse;
};
