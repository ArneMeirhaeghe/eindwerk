// src/types/User.ts
export interface User {
  id: string      // LET OP: niet _id, maar id zoals de API teruggeeft
  email: string
  role: "user" | "admin"
}

export interface UserCreateRequest {
  email: string
  password: string
  // role stuur je niet mee bij aanmaken; admin wijzigt rol later via PATCH
}
