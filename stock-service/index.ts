import "reflect-metadata";
import { container } from "./src/infrastructure/configurations/container";
import { Settings } from "./src/infrastructure/configurations/settings";
import { ProcessHttpRequest } from "./src/interface/api/process-http-request";

const app =  container.get(ProcessHttpRequest).configure()
const settings =  container.get(Settings)

const port = settings.apiPort || 3333;

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);