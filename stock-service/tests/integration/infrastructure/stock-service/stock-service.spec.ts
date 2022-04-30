import nock from "nock";
import { Settings } from "../../../../src/infrastructure/configurations/settings";
import faker from "faker";
import { HttpStatusCode } from "../../../../src/infrastructure/http/http-status-code";
import { StockService } from "../../../../src/infrastructure/stock-service/stock-service";
import { Stock } from "../../../../src/domain/entities/stock";
import { ResultSuccess } from "../../../../src/application/contracts/result/result/result-success";
import { ResultError } from "../../../../src/application/contracts/result/result/result-error";

const generateServiceDependencies = () => {
  const settings = {
    stockServiceUrl: faker.internet.url(),
  } as Settings;

  return {
    settings,
  };
};

describe("Integration", () => {
  describe("Infrastructure", () => {
    describe("StockService", () => {
      beforeEach(() => {
        nock.disableNetConnect();
      });

      afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
      });

      describe("getStock()", () => {
        it("Should return an stock information on success", async () => {
          // given
          const dependencies = generateServiceDependencies();

          const stockService = new StockService(dependencies.settings);

          const stockThirdPartyApiResponse =
            "Symbol,Date,Time,Open,High,Low,Close,Volume,Name\r\n" +
            "AAPL.US,2022-04-29,22:00:08,161.84,166.2,157.25,157.65,131747571,APPLE\r\n";

          const expectedResult = new ResultSuccess([
            new Stock({
              symbol: "AAPL.US",
              open: 161.84,
              high: 166.2,
              low: 157.25,
              close: 157.65,
              name: "APPLE",
            }),
          ]);

          // when
          nock(dependencies.settings.stockServiceUrl)
            .get(() => true)
            .reply(HttpStatusCode.SUCCESS, stockThirdPartyApiResponse);

          const result = await stockService.getStock(faker.random.word());

          // then
          expect(result).toEqual(expectedResult);
        });

        it("Should return an error if receives an invalid payload", async () => {
          // given
          const dependencies = generateServiceDependencies();

          const stockService = new StockService(dependencies.settings);

          const stockThirdPartyApiResponse =
            "Date,Time,Open,High,Low,Close,Volume\r\n" +
            "AAPL.US,2022-04-29,22:00:08,161.84,166.2,157.25,157.65,131747571,APPLE\r\n";

          const expectedResult = new ResultError("Received an invalid stock");

          // when
          nock(dependencies.settings.stockServiceUrl)
            .get(() => true)
            .reply(HttpStatusCode.SUCCESS, stockThirdPartyApiResponse);

          const result = await stockService.getStock(faker.random.word());

          // then
          expect(result).toEqual(expectedResult);
        });

        it("Should return an error if receives could not call the stock API", async () => {
          // given
          const dependencies = generateServiceDependencies();

          const stockService = new StockService(dependencies.settings);

          const expectedResult = new ResultError("Failed to get stock");

          // when
          nock(dependencies.settings.stockServiceUrl)
            .get(() => true)
            .reply(HttpStatusCode.INTERNAL_SERVER_ERROR);

          const result = await stockService.getStock(faker.random.word());

          // then
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
});
