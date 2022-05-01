import { Connection, createConnection, getConnectionManager } from "typeorm";
import { inject, injectable } from "inversify";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { DatabaseOptions } from "../configurations/types";

@injectable()
export class DatabaseConnection {
  private connection?: Connection;
  private readonly databaseOptions: PostgresConnectionOptions;

  public constructor(@inject(DatabaseOptions) databaseOptions: PostgresConnectionOptions) {
    this.databaseOptions = databaseOptions;
  }

  public async closeConnection(): Promise<void> {
    console.log("closeConnection");

    if (this.connection?.isConnected) {
      await this.connection.close();
    }
  }

  public async getConnection(): Promise<Connection> {
    console.log("Start");

    try {
      if (this.connection?.isConnected === true) {
        console.log("Exists connection", { connection: this.connection });
        return this.connection;
      }

      this.connection = await createConnection(this.databaseOptions);

      console.log("Exists connection", { connection: this.connection });

      return this.connection;
    } catch (error) {
      console.error("Failed to get connection", { error });
      return getConnectionManager().get("default");
    }
  }
}
