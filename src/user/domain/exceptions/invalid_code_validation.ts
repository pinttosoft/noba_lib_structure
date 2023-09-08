import { DomainException } from "../../../shared";

export class InvalidCodeValidation extends DomainException {
  name = "invalid_code";
  message = "Code for validation expired";
}
