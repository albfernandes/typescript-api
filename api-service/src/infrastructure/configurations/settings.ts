import { inject, injectable } from "inversify";
import { Envs } from "./types";
import Dict = NodeJS.Dict;

@injectable()
export class Settings {
  private readonly envs: Dict<string>;

  public constructor(@inject(Envs) envs: Dict<string>) {
    this.envs = envs;
  }

  public get apiPort(): number {
    return Number(this.returnOrThrow("PORT"));
  }

  public get databaseName(): string {
    return this.returnOrThrow("DATABASE_NAME");
  }

  public get databaseHost(): string {
    return this.returnOrThrow("DATABASE_HOST");
  }

  public get databasePort(): number {
    return Number(this.returnOrThrow("DATABASE_PORT"));
  }

  public get databaseUsername(): string {
    return this.returnOrThrow("DATABASE_USERNAME");
  }

  public get databasePassword(): string {
    return this.returnOrThrow("DATABASE_PASSWORD");
  }

  private returnOrThrow(property: string): string {
    const value = this.envs[property];
    if (value === undefined) {
      throw new Error(`Empty setting: ${property}`);
    }

    return value;
  }
}
