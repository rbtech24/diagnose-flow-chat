
import { User } from "@/types/user";
import { FeatureRequestUser } from "@/types/feature-request";

export function convertToFeatureRequestUser(user: User): FeatureRequestUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl
  };
}

export function ensureFeatureRequestUser(user: User): FeatureRequestUser {
  return convertToFeatureRequestUser(user);
}
