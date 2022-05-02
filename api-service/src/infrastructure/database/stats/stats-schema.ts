import { EntitySchema } from "typeorm";
import { Stats } from "../../../domain/entities/Stats";

export const StatsEntity = new EntitySchema<Stats>({
  name: "stats",
  tableName: "stats",
  columns: {
    stock: { type: "text", primary: true },
    timesRequested: { type: "int" },
  },
});
