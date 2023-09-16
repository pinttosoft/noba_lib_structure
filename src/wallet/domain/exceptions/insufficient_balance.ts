import { DomainException } from "../../../shared";

export class InsufficientBalance extends DomainException {
  name = "insufficient_balance";
  message = "Insufficient balance to make the transfer";
}
