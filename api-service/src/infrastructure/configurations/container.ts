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

const container: Container = new Container();

decorate(injectable(), Controller);

// values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);
container.bind(Types.DatabaseOptions).toConstantValue(databaseOptions);

// command handlers
container.bind(RegisterUserCommandHandler).toSelf();

// infrastructure
container.bind(Settings).toSelf();
container.bind(UserRepository).toSelf();
container.bind(CryptographyService).toSelf();
container.bind(DatabaseConnection).toSelf().inSingletonScope();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(RegisterController).toSelf();

export { container, container as iocContainer };
