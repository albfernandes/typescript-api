import { NonFunctionProperties } from "../../application/contracts/types";

type CreateStatsParams = Omit<NonFunctionProperties<Stats>, "timesRequested">;

export class Stats {
  public readonly stock: string;
  public timesRequested: number;

  public constructor(data: NonFunctionProperties<Stats>) {
    this.stock = data.stock;
    this.timesRequested = data.timesRequested;
  }

  public incrementCounter(increment = 1): void {
    this.timesRequested += increment;
  }

  public static create(data: CreateStatsParams): Stats {
    return new Stats({
      stock: data.stock,
      timesRequested: 1,
    });
  }
}
