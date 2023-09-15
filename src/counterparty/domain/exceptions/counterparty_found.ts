import { DomainException } from "../../../shared";

export class CounterpartyFound extends DomainException {
  name = "counterparty_found";
  message = "The counterparty is already registered.";
}
