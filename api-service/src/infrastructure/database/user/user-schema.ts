import { EntitySchema } from "typeorm";
import { User } from "../../../domain/entities/User";
import { RoleEnum } from "../../../domain/enums/Role";

export const UserEntity = new EntitySchema<User>({
  name: "user",
  tableName: "users",
  columns: {
    email: { type: "text" },
    password: { type: "text" },
    role: { type: "enum", enum: RoleEnum },
    id: { type: "text", primary: true },
    createdAt: { type: "timestamp" },
  },
});
