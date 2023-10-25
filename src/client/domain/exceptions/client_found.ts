import { DomainException } from "../../../shared";

export class ClientFound extends DomainException {
  name = "client_found";
  message = "Client is already registered";
}
