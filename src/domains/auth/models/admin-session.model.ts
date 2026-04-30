export interface AdminSession {
  token: string;
  user: {
    id: string;
    role: 'admin';
    name: string;
  };
}
