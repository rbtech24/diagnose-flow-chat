
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  phone?: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "pending" | "archived" | "deleted";
  companyId?: string;
}

export interface UserWithPassword extends User {
  password: string;
}
