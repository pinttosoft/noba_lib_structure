import { AggregateRoot } from "../../shared/domain/aggregate_root";

export class BankingRails extends AggregateRoot {
  private id?: string;
  private countryCode: string;
  private countryName: string;
  private counterpartyType?: string;
  private assetCountry: string;
  private rail: Array<string>;

  getId(): string {
    return this.id;
  }

  getCountryCode(): string {
    return this.countryCode;
  }

  getAssetCountry(): string {
    return this.assetCountry;
  }

  getCounterpartyType(): string | undefined {
    return this.counterpartyType;
  }

  getCountyName(): string {
    return this.countryName;
  }

  setRails(rails: Array<string>) {
    this.rail = rails;
  }

  setAssetCountry(assetCountry: string) {
    this.assetCountry = assetCountry;
  }

  setCountryCode(countryCode: string) {
    this.countryCode = countryCode;
  }

  setCountryName(countryName: string) {
    this.countryName = countryName;
  }

  setCounterpartyType(counterpartyType?: string) {
    this.counterpartyType = counterpartyType;
  }

  static newBankingRail(data: any): BankingRails {
    const rail = new BankingRails();
    rail.id = data.id;
    rail.countryCode = data.countryCode;
    rail.countryName = data.countryName;
    rail.assetCountry = data.assetCountry;
    rail.rail = data.rails;
    rail.counterpartyType = data.counterpartyType;

    return rail;
  }

  static fromPrimitives(data: any): BankingRails {
    const rail = new BankingRails();
    rail.id = data.id;
    rail.countryCode = data.countryCode;
    rail.countryName = data.countryName;
    rail.assetCountry = data.assetCountry;
    rail.rail = data.rail;
    rail.counterpartyType = data.counterpartyType;

    return rail;
  }

  toPrimitives(): any {
    return {
      countryCode: this.countryCode,
      countryName: this.countryName,
      assetCountry: this.assetCountry,
      rails: this.rail,
      counterpartyType: this.counterpartyType,
    };
  }
}
