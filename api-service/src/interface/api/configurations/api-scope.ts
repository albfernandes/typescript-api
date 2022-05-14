import { RoleEnum } from "../../../domain/enums/Role";

export const API_SCOPE: { [key in RoleEnum]: RoleEnum[] } = {
  [RoleEnum.ADMIN]: [RoleEnum.ADMIN, RoleEnum.USER],
  [RoleEnum.USER]: [RoleEnum.USER],
};
