import "reflect-metadata";
import { container } from "./src/infrastructure/configurations/container";
import { Settings } from "./src/infrastructure/configurations/settings";
import { ProcessGraphqlRequest } from "./src/interface/api/graphql/process-graphql-request";
import { ProcessHttpRequest } from "./src/interface/api/process-http-request";

const settings = container.get(Settings);

const port = settings.apiPort || 3333;

(async () => {
  const app = container.get(ProcessHttpRequest).configure();
  const graphql = container.get(ProcessGraphqlRequest).configure();

  app.listen(port, () => console.log(`app listening at http://localhost:${port}`));
  (await graphql).listen({ port: 5555 }, () => console.log(`app listening at http://localhost:${5555}`));
})();
