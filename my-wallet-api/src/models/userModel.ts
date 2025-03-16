export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface MyProfileRequest {
  userId: number;
}

export interface MyProfileResponse {
  id: number;
  username: string;
  email: string;
}
