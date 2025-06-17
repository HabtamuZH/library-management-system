export interface User {
  id: number;
  username: string;
  role: string;
  createdAt: Date;
}

export interface CreateUser {
  username: string;
  password: string;
  role: string;
}

export interface UpdateUser {
  username: string;
  password?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: Date;
}

