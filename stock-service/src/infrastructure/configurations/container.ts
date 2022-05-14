import { Container, decorate, injectable } from "inversify";
import * as Types from "./types";
import { Settings } from "./settings";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { Controller } from "tsoa";
import { StockController } from "../../interface/api/controllers/stock-controller";
import { StockService } from "../stock-service/stock-service";
import { GetStockCommandHandler } from "../../application/get-stock/get-stock-command-handler";

const container: Container = new Container();

decorate(injectable(), Controller);

// command handlers
container.bind(GetStockCommandHandler).toSelf();

// values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);

// infrastructure
container.bind(Settings).toSelf();
container.bind(StockService).toSelf();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(StockController).toSelf();

export { container, container as iocContainer };
