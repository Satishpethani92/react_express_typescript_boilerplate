export interface UserDto {
  id: string;
  email: string;
  phoneNumber: string;
  status: string;
  userName: string;
  role: string;
}

export interface UserDetailsDto {
  id: string;
  email: string;
  phoneNumber: string;
  status: string;
  userName: string;
  role: string;
}

export interface LoginDto extends UserDto {
  token: string;
}

export declare type UserPayload = {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export declare type LoginPayload = {
  email: string;
  password: string;
};
