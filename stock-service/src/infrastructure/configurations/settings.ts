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

  private returnOrThrow(property: string): string {
    const value = this.envs[property];
    if (value === undefined) {
      throw new Error(`Empty setting: ${property}`);
    }

    return value;
  }
}
