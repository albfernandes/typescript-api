import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatsTable1651413033203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS stats
    (
      "stock" TEXT NOT NULL,
      "times_requested" INT NOT NULL,
      CONSTRAINT "stats_pk" PRIMARY KEY ("stock")
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "stats";`);
  }
}
