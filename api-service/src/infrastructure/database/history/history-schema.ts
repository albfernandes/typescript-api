import { EntitySchema } from "typeorm";
import { History } from "../../../domain/entities/History";

export const HistoryEntity = new EntitySchema<History>({
  name: "history",
  tableName: "historical",
  columns: {
    name: { type: "text" },
    symbol: { type: "text" },
    open: { type: "float" },
    high: { type: "float" },
    low: { type: "float" },
    close: { type: "float" },
    date: { type: "timestamp" },
    userId: { type: "text" },
    id: { type: "text", primary: true },
  },
  relations: {
    userId: {
      type: "one-to-one",
      target: "user",
      joinColumn: {
        name: "userId",
        referencedColumnName: "id",
      },
    },
  },
});
