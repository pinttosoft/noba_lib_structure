import { DomainException } from "../../../shared";

export class StateNotFound extends DomainException {
  name = "states_not_found";
  constructor(country: string) {
    super();
    this.message = `No fueron encontrado estados por el pais ${country}`;
  }
}
