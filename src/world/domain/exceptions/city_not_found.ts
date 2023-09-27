import { DomainException } from "../../../shared";

export class CityNotFound extends DomainException {
  name = "cities_not_found";
  constructor(country: string, state: string) {
    super();
    this.message = `No fueron encontrada ciudades por el pais ${country} y estado ${state}`;
  }
}
