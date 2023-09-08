import { DomainException } from "../../../shared";

export class CodeValidationNotFound extends DomainException {
  name = "code_not_found";
  message = "Validation code not found. Please request a new code";
}
