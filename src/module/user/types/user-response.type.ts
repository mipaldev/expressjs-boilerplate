type UserBase = {
  id: string;
  name: string;
  email: string;
};

export type UserResponse = UserBase;

export type UserDetailResponse = UserBase & {
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = UserBase & {
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
