import { Container, decorate, injectable } from "inversify";
import * as Types from "./types";
import { Settings } from "./settings";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { Controller } from "tsoa";
import { GetStockController } from "../../interface/api/controllers/get-stock-controller";

const container: Container = new Container();

decorate(injectable(), Controller);

// values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);

// infrastructure
container.bind(Settings).toSelf();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(GetStockController).toSelf();

export { container, container as iocContainer };
