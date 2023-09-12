import { DomainException } from "../../../shared";

export class ClientNotFound extends DomainException {
  name = "client_not_found";
  message = "There is no registered client";
}
