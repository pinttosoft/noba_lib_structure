import { DomainException } from "../../../shared";

export class CounterpartyNotFound extends DomainException {
  name = "counterparty_not_found";
  message = "The counterparty is not registered.";
}
