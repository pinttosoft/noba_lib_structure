import { AggregateRoot } from "../../shared/domain/aggregate_root";

type country = {
  id: string;
  country_id: string;
  country_code: string;
  name: string;
  calling_code: string;
  fee_shipping?: number;
};

export class Country extends AggregateRoot {
  private id?: string;
  private country_id: string;
  private country_code: string;
  private name: string;
  private calling_code: string;
  private fee_shipping?: number;

  getId(): string {
    return this.id;
  }

  static newCountry(data: country): Country {
    const country: Country = new Country();
    country.id = data.id;
    country.country_id = data.country_id;
    country.country_code = data.country_code;
    country.name = data.name;
    country.calling_code = data.calling_code;
    country.fee_shipping = data.fee_shipping ?? 0;

    return country;
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

  getFeeShipping(): number {
    return this.fee_shipping ?? 0;
  }

  static fromPrimitives(data: country): Country {
    const country: Country = new Country();
    country.id = data.id;
    country.country_id = data.country_id;
    country.country_code = data.country_code;
    country.name = data.name;
    country.calling_code = data.calling_code;
    country.fee_shipping = data.fee_shipping ?? 0;

    return country;
  }

  toPrimitives(): any {
    return {
      country_id: this.country_id,
      country_code: this.country_code,
      name: this.name,
      calling_code: this.calling_code,
      fee_shipping: this.fee_shipping ?? 0,
    };
  }
}
