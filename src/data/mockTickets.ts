
import { User } from "@/types/user";

export const currentUser: User & { avatar_url?: string } = {
  id: "current-user",
  name: "John Doe",
  email: "john@example.com",
  role: "company",
  avatar_url: "https://i.pravatar.cc/150?u=john",
};
