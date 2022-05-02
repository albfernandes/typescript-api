import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Settings } from "../configurations/settings";
import { HistoryEntity } from "./history/history-schema";
import { UserEntity } from "./user/user-schema";

const settings = new Settings(process.env);

const databaseOptions: PostgresConnectionOptions = {
  database: settings.databaseName,
  entities: [UserEntity, HistoryEntity],
  host: settings.databaseHost,
  logging: [],
  migrations: ["src/infrastructure/database/migrations/*.[j|t]s"],
  namingStrategy: new SnakeNamingStrategy(),
  password: settings.databasePassword,
  port: settings.databasePort,
  synchronize: false,
  subscribers: ["src/infrastructure/database/database-general-subscriber.[j|t]s"],
  type: "postgres",
  username: settings.databaseUsername,
};

export = databaseOptions;
