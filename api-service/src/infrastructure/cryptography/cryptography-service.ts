import { inject, injectable } from "inversify";
import { Settings } from "../configurations/settings";
import { ResultSuccess } from "../../application/contracts/result/result/result-success";
import { ResultError } from "../../application/contracts/result/result/result-error";
import { Result } from "../../application/contracts/result/result/result";
import { JwtPayload, sign, verify } from "jsonwebtoken";

@injectable()
export class CryptographyService {
  private readonly settings: Settings;

  public constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;
  }

  public async encrypt(payload: string | Object | Buffer): Promise<Result<string>> {
    try {
      console.log("Starting encrypt");

      const token = await sign(payload, this.settings.tokenSecret);

      return new ResultSuccess(token);
    } catch (error) {
      console.error("Failed to encrypt", { error });
      return new ResultError("Failed to encrypt");
    }
  }

  public async decrypt(encodedToken: string): Promise<Result<string | JwtPayload>> {
    try {
      console.log("Starting decrypt");

      const decodedToken = await verify(encodedToken, this.settings.tokenSecret);

      return new ResultSuccess(decodedToken);
    } catch (error) {
      console.error("Failed to decrypt", { error });
      return new ResultError("Failed to decrypt");
    }
  }
}
