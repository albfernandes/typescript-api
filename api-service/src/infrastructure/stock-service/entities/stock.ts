import { IsDefined, IsNumber, IsString } from "class-validator";
import { NonFunctionProperties } from "../../application/contracts/types";

export class Stock {
  @IsDefined()
  @IsString()
  public name!: string;

  @IsDefined()
  @IsString()
  public symbol!: string;

  @IsDefined()
  @IsNumber()
  public open!: number;

  @IsDefined()
  @IsNumber()
  public high!: number;

  @IsDefined()
  @IsNumber()
  public low!: number;

  @IsDefined()
  @IsNumber()
  public close!: number;

  public constructor(data: NonFunctionProperties<Stock>) {
    this.name = data.name;
    this.symbol = data.symbol;
    this.open = data.open;
    this.high = data.high;
    this.low = data.low;
    this.close = data.close;
  }
}
