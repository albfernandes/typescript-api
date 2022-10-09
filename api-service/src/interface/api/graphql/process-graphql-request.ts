import { ApolloServer } from "apollo-server";
import { inject, injectable } from "inversify";
import { SchemaBuilder } from "./schemas/schema-builder";

@injectable()
export class ProcessGraphqlRequest {
  private readonly schemaBuilder: SchemaBuilder;

  constructor(@inject(SchemaBuilder) schemaBuilder: SchemaBuilder) {
    this.schemaBuilder = schemaBuilder;
  }

  public async configure(): Promise<ApolloServer> {
    const schema = await this.schemaBuilder.build();

    return new ApolloServer({ schema });
  }
}
