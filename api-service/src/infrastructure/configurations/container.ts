import { Container, decorate, injectable } from "inversify";
import * as Types from "./types";
import { Settings } from "./settings";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { Controller } from "tsoa";
import { RegisterController } from "../../interface/api/controllers/register-controller";
import { RegisterUserCommandHandler } from "../../application/register-user/register-user-command-handler";
import { UserRepository } from "../database/user/user-repository";
import { CryptographyService } from "../cryptography/cryptography-service";
import { DatabaseConnection } from "../database/database-connection";
import databaseOptions from "../database/database-options";
import { StockController } from "../../interface/api/controllers/stock-controller";
import { GetStockCommandHandler } from "../../application/get-stock/get-stock-command-handler";
import { StockService } from "../stock-service/stock-service";
import { AuthenticateUserCommandHandler } from "../../application/authenticate-user/authenticate-user-command-handler";
import { HistoryRepository } from "../database/history/history-repository";
import { HistoryController } from "../../interface/api/controllers/history-controller";
import { StatsRepository } from "../database/stats/stats-repository";
import { StatsController } from "../../interface/api/controllers/stats-controller";

const container: Container = new Container();

decorate(injectable(), Controller);

// values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);
container.bind(Types.DatabaseOptions).toConstantValue(databaseOptions);

// command handlers
container.bind(RegisterUserCommandHandler).toSelf();
container.bind(GetStockCommandHandler).toSelf();
container.bind(AuthenticateUserCommandHandler).toSelf();

// infrastructure
container.bind(Settings).toSelf();
container.bind(UserRepository).toSelf();
container.bind(HistoryRepository).toSelf();
container.bind(StatsRepository).toSelf();
container.bind(CryptographyService).toSelf();
container.bind(DatabaseConnection).toSelf().inSingletonScope();
container.bind(StockService).toSelf();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(RegisterController).toSelf();
container.bind(StockController).toSelf();
container.bind(HistoryController).toSelf();
container.bind(StatsController).toSelf();

export { container, container as iocContainer };
