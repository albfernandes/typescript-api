import { Container, decorate, injectable } from "inversify";
import * as Types from "./types";
import { Settings } from "./settings";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { Controller } from "tsoa";
import { RegisterController } from "../../interface/api/controllers/register-controller";
import { SignService } from "../sign-service/sign-service";
import { DatabaseConnection } from "../database/database-connection";
import databaseOptions from "../database/database-options";
import { StockController } from "../../interface/api/controllers/stock-controller";
import { StockService } from "../stock-service/stock-service";
import { HistoryRepository } from "../database/history/history-repository";
import { HistoryController } from "../../interface/api/controllers/history-controller";
import { StatsRepository } from "../database/stats/stats-repository";
import { StatsController } from "../../interface/api/controllers/stats-controller";
import { CryptographyService } from "../cryptography-service/cryptography-service";
import { LoginController } from "../../interface/api/controllers/login-controller";
import { AuthenticateUserCommandHandler } from "../../application/handlers/authenticate-user/authenticate-user-command-handler";
import { GetStockCommandHandler } from "../../application/handlers/get-stock/get-stock-command-handler";
import { LoginCommandHandler } from "../../application/handlers/login/login-command-handler";
import { RegisterUserCommandHandler } from "../../application/handlers/register-user/register-user-command-handler";
import { IUserRepository } from "../../application/contracts/iuser-repository";
import { IHistoryRepository } from "../../application/contracts/ihistory-repository";
import { IStatsRepository } from "../../application/contracts/istats-repository";
import { UserRepository } from "../database/user/user-repository";

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
container.bind(LoginCommandHandler).toSelf();

// infrastructure
container.bind(Settings).toSelf();
container.bind<IUserRepository>(Types.IUserRepository).to(UserRepository);
container.bind<IHistoryRepository>(Types.IHistoryRepository).to(HistoryRepository);
container.bind<IStatsRepository>(Types.IStatsRepository).to(StatsRepository);
container.bind(SignService).toSelf();
container.bind(DatabaseConnection).toSelf().inSingletonScope();
container.bind(StockService).toSelf();
container.bind(CryptographyService).toSelf();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(RegisterController).toSelf();
container.bind(StockController).toSelf();
container.bind(HistoryController).toSelf();
container.bind(StatsController).toSelf();
container.bind(LoginController).toSelf();

export { container, container as iocContainer };
