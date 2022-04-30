import faker from "faker";
import { HttpStatusCode } from "../../src/infrastructure/http/http-status-code";
import request from "supertest";
import { container } from "../../src/infrastructure/configurations/container";
import { ProcessHttpRequest } from "../../src/interface/api/process-http-request";
import { generateStockInformation } from "../integration/fixtures/stock-fixture";
import nock from "nock";
import { Settings } from "../../src/infrastructure/configurations/settings";
import { Stock } from "../../src/domain/entities/stock";

const settings = new Settings(process.env);

describe("System", () => {
  describe("GetStockInformationRoute", () => {
    it("Should return 404 when route is not found", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({
          message: "Route not Found",
        }),
        statusCode: HttpStatusCode.NOT_FOUND,
      };

      const stockCode = faker.random.word();

      // when
      const result = await request(app).get("/stock-service/api/v1").query({ stockCode });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });

    it.only("Should return 200 with an array of stock informations on success", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();
      const stockInformation = generateStockInformation({
        symbol: "AAPL.US",
        open: 161.84,
        high: 166.2,
        low: 157.25,
        close: 157.65,
        name: "APPLE",
      });

      const expectedResult = {
        body: stockInformation,
        statusCode: HttpStatusCode.SUCCESS,
      };

      const stockThirdPartyApiResponse =
        "Symbol,Date,Time,Open,High,Low,Close,Volume,Name\r\n" +
        "AAPL.US,2022-04-29,22:00:08,161.84,166.2,157.25,157.65,131747571,APPLE\r\n";

      // when
      nock(settings.stockServiceUrl)
        .get(() => true)
        .reply(HttpStatusCode.SUCCESS, stockThirdPartyApiResponse);

      const stockCode = faker.random.word();

      // when
      const result = await request(app).get("/stock-service/api/v1/stock").query({ stockCode });

      const apiResponsePayload = JSON.parse(result.text)[0] as Stock;

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(apiResponsePayload.symbol).toEqual(expectedResult.body.symbol);
      expect(apiResponsePayload.name).toEqual(expectedResult.body.name);
      expect(apiResponsePayload.high).toEqual(expectedResult.body.high);
      expect(apiResponsePayload.low).toEqual(expectedResult.body.low);
      expect(apiResponsePayload.close).toEqual(expectedResult.body.close);
    });
  });
});
