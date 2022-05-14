import express, { NextFunction } from "express";
import { injectable, inject } from "inversify";
import { BodyParserMiddleware } from "./middlewares/body-parser-middleware";
import { ErrorMiddleware } from "./middlewares/error-middleware";
import { RegisterRoutes } from "./routes";
import { HttpStatusCode } from "../../infrastructure/http/http-status-code";

@injectable()
export class ProcessHttpRequest {
  private readonly bodyParserMiddleware: BodyParserMiddleware;

  private readonly errorMiddleware: ErrorMiddleware;

  constructor(
    @inject(BodyParserMiddleware) bodyParserMiddleware: BodyParserMiddleware,
    @inject(ErrorMiddleware) errorMiddleware: ErrorMiddleware,
  ) {
    this.bodyParserMiddleware = bodyParserMiddleware;
    this.errorMiddleware = errorMiddleware;
  }

  public configure(): express.Express {
    const app = express();
    this.bodyParserMiddleware.configure(app);
    this.configureRoutes(app);
    this.errorMiddleware.configure(app);

    return app;
  }

  private configureRoutes(app: express.Express): void {
    RegisterRoutes(app);

    app.use((_request: express.Request, response: express.Response, next: NextFunction) => {
      response
        .status(HttpStatusCode.NOT_FOUND)
        .send({
          message: "Route not Found",
        })
        .end();

      next();
    });
  }
}
