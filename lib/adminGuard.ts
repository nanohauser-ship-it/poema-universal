import type { User } from "@supabase/supabase-js";

export const ADMIN_EMAIL = "nanohauser@gmail.com";

export function esAdmin(user: User | null) {
  if (!user?.email) return false;

  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}