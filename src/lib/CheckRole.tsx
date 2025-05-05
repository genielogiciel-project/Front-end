import { UserRole } from "./types";

export const CheckRole = (
  userRoles: UserRole[],
  permissions: UserRole[],
  excludeSuperAdmin = false
) => {
  !excludeSuperAdmin && permissions.push(UserRole.SUPER_ADMIN);
  return userRoles?.some((role) => permissions.includes(role));
};
