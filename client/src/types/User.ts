// File: client/src/types/User.ts
export interface User {
  id: string;      // Let op: API retourneert 'id' ipv. '_id'
  email: string;
  role: 'user' | 'admin';
}

export interface UserCreateRequest {
  email: string;
  password: string;
  // role wordt niet meegestuurd bij aanmaken; admin wijzigt rol later via PUT
}
