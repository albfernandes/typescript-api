import { injectable } from "inversify";
import { buildSchemaSync } from "type-graphql";
import { HistoryResolver } from "../resolvers/history-resolver";
import { HistoryType } from "./history-type";
import { iocContainer } from "../../../../infrastructure/configurations/container";

@injectable()
export class SchemaBuilder {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async build() {
    return buildSchemaSync({ resolvers: [HistoryType, HistoryResolver], container: iocContainer });
  }
}
