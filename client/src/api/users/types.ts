// File: src/api/users/types.ts

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  role: "user" | "admin";
}
