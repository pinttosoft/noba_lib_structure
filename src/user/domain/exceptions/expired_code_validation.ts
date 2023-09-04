import { DomainException } from "../../../shared";

export class ExpiredCodeValidation extends DomainException {
  name = "code_expired";
  message = "Validation code expired";
}
