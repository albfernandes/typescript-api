import { ResultError } from "../../../../src/application/contracts/result/result/result-error";
import faker from "faker";
import { GetStockCommand } from "../../../../src/application/get-stock/get-stock-command";
import { GetStockCommandHandler } from "../../../../src/application/get-stock/get-stock-command-handler";
import { StockService } from "../../../../src/infrastructure/stock-service/stock-service";
import { generateStockInformation } from "../../../integration/fixtures/stock-fixture";
import { ResultSuccess } from "../../../../src/application/contracts/result/result/result-success";

interface MockDependencies {
  getStock?: Function;
}

const generateCommand = (stockCode?: string): GetStockCommand => {
  return new GetStockCommand({
    stockCode: stockCode ?? faker.random.word(),
  });
};

const createCommandHandlerInstance = (mockDependencies: MockDependencies): GetStockCommandHandler => {
  const getStockService = {
    getStock: mockDependencies.getStock,
  } as unknown as StockService;

  return new GetStockCommandHandler(getStockService);
};

describe("Unit", () => {
  describe("Application", () => {
    describe("GetStockCommandHandler", () => {
      it("Should return an error when fails get stock information", async () => {
        // given
        const getStockResult = new ResultError("Failed to get stock");
        const randomStockCode = faker.random.word();
        const command = generateCommand(randomStockCode);

        const dependencies: MockDependencies = {
          getStock: jest.fn().mockReturnValue(getStockResult),
        };
        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: getStockResult,
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(dependencies.getStock).toHaveBeenNthCalledWith(1, randomStockCode);
        expect(result).toEqual(expects.result);
      });

      it("Should return an array of stocks containing its informations", async () => {
        // given
        const getStockResult = new ResultSuccess([generateStockInformation()]);
        const randomStockCode = faker.random.word();
        const command = generateCommand(randomStockCode);

        const dependencies: MockDependencies = {
          getStock: jest.fn().mockReturnValue(getStockResult),
        };
        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: getStockResult,
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(dependencies.getStock).toHaveBeenNthCalledWith(1, randomStockCode);
        expect(result).toEqual(expects.result);
      });
    });
  });
});
