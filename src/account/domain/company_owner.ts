import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { CompanyDTO } from "../../client";
import { Address } from "../../shared";

export class CompanyOwner implements IOwnerAccount {
  constructor(private readonly company: CompanyDTO) {}

  getAddress(): Address {
    return {
      streetOne: this.company.streetOne,
      streetTwo: this.company.streetTwo,
      postalCode: this.company.postalCode,
      city: this.company.city,
      region: this.company.region,
      country: this.company.country,
    };
  }

  getIdentifyNumber(): string {
    return this.company.registerNumber;
  }

  getEmail(): string {
    return this.company.email;
  }

  getName(): string {
    return this.company.name;
  }

  toPrimitives(): any {
    return { ...this.company };
  }
}
