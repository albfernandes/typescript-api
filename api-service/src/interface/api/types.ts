export interface ErrorResult {
  message: string;
}

import { FieldErrors } from "tsoa";

export interface ValidationErrorResult extends ErrorResult {
  details: FieldErrors;
}
