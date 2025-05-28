
import { User } from "@/types/user";

export const currentUser: User & { avatar_url?: string } = {
  id: "",
  name: "",
  email: "",
  role: "company",
  avatar_url: "",
};
