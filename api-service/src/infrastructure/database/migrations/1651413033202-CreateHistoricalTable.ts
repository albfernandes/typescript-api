import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHistoricalTable1651413033201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS historical
    (
      "name" TEXT NOT NULL,
      "symbol" TEXT NOT NULL,
      "open" FLOAT NOT NULL,
      "high" FLOAT NOT NULL,
      "low" FLOAT NOT NULL,
      "close" FLOAT NOT NULL,
      "date" timestamptz NOT NULL,
      "user_id" uuid NOT NULL,
      "id" uuid NOT NULL,
      CONSTRAINT "historical_pk" PRIMARY KEY ("id"),
      CONSTRAINT "historical_fk1" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "historical";`);
  }
}
