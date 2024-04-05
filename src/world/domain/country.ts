import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class Country extends AggregateRoot {
  private id?: string;
  private country_id: string;
  private country_code: string;
  private name: string;
  private calling_code: string;

  getId(): string {
    return this.id;
  }

  setName(name: string) {
    this.name = name;
  }

  setCountryId(countryId: string) {
    this.country_id = countryId;
  }

  setCountryCode(countryCode: string) {
    this.country_code = countryCode;
  }

  setCallingCode(callingCode: string) {
    this.calling_code = callingCode;
  }

  static newCountry(data: any): Country {
    const country: Country = new Country();
    country.id = data.id;
    country.country_id = data.country_id;
    country.country_code = data.country_code;
    country.name = data.name;
    country.calling_code = data.calling_code;

    return country;
  }

  static fromPrimitives(data: any): Country {
    const country: Country = new Country();
    country.id = data.id;
    country.country_id = data.country_id;
    country.country_code = data.country_code;
    country.name = data.name;
    country.calling_code = data.calling_code;

    return country;
  }

  toPrimitives(): any {
    return {
      country_id: this.country_id,
      country_code: this.country_code,
      name: this.name,
      calling_code: this.calling_code,
    };
  }
}
