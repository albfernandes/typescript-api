import { NonFunctionProperties } from "../../../src/application/contracts/types";
import faker from "faker";
import { Stock } from "../../../src/domain/entities/stock";

export const generateStockInformation = (
  data?: Partial<NonFunctionProperties<Stock>>,
): NonFunctionProperties<Stock> => {
  return {
    symbol: faker.random.word(),
    open: faker.datatype.number(),
    high: faker.datatype.number(),
    low: faker.datatype.number(),
    close: faker.datatype.number(),
    name: faker.random.word(),
    ...data,
  };
};
