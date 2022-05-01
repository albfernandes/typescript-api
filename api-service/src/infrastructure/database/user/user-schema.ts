import { EntitySchema } from "typeorm";
import { User } from "../../../domain/entities/User";

export const UserEntity = new EntitySchema<User>({
  name: "users",
  columns: {
    name: { type: "text" },
    role: { type: "text" },
    id: { type: "text" },
    createdAt: { type: "timestamp" },
  },
});
