import { injectable } from "inversify";
import { Route, Controller, Tags, Get, Response } from "tsoa";
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
  @Get("/v1/test")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getStock(

  ): Promise<string | ErrorResult> {
    console.log("testing first route");

    return "testing";
  }
}
