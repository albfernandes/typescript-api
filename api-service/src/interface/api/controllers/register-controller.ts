import { injectable } from "inversify";
import { Route, Controller, Tags, Response, Post } from "tsoa";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { ErrorResult } from "../types";

@injectable()
@Route()
export class GetStockController extends Controller {
  constructor() {
    super();
  }

  /**
   * blablabla.
   */
  @Tags("blabla")
  @Post("/v1/test")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async register(): Promise<string | ErrorResult> {
    console.log("testing first route");

    return "registering";
  }
}
