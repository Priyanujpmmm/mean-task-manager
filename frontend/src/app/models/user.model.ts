export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse extends User {
  token: string;
}
