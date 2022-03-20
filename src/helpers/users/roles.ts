import { RoleEnum, UserDocument } from "src/models/users.model";

export const IsAdmin = (user: UserDocument): boolean => {
  if (user.role == RoleEnum.ADMIN) return true;
  return false;
};

export const IsUser = (user: UserDocument): boolean => {
  if (user.role == RoleEnum.USER) return true;
  return false;
};
