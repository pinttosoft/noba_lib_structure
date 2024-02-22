export class Country {
  private countryId: string;
  private countryCode: string;
  private name: string;
  private callingCode: string;

  constructor(
    countryId: string,
    countryCode: string,
    name: string,
    callingCode: string,
  ) {
    this.countryId = countryId;
    this.countryCode = countryCode;
    this.name = name;
    this.callingCode = callingCode;
  }

  getCountryId(): string {
    return this.countryId;
  }

  getCountryCode(): string {
    return this.countryCode;
  }

  getName(): string {
    return this.name;
  }

  getCallingCode(): string {
    return this.callingCode;
  }

  static fromPrimitives(data: any): Country {
    return new Country(
      data.country_id,
      data.country_code,
      data.name,
      data.calling_code,
    );
  }

  toPrimitives(): any {
    return {
      country_id: this.countryId,
      country_code: this.countryCode,
      name: this.name,
      calling_code: this.callingCode,
    };
  }
}
