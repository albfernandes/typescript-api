import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1651413033201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS users
    (
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "created_at" timestamptz NOT NULL,
      "id" uuid NOT NULL,
      CONSTRAINT "users_pk" PRIMARY KEY ("id")
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
