import { DomainException } from "../../../shared";

export class InvalidateCodeValidation extends DomainException {
  name = "invalid_code_validation";
  message = "the reported code is invalid";
}
