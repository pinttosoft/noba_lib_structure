import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { IndividualDTO } from "../../client";
import { Address } from "../../shared";

export class IndividualOwner implements IOwnerAccount {
  constructor(private readonly individual: IndividualDTO) {}

  getName(): string {
    return (
      this.individual.firstName +
      " " +
      this.individual.middleName +
      " " +
      this.individual.lastName
    );
  }

  getEmail(): string {
    return this.individual.email;
  }

  getIdentifyNumber(): string {
    return this.individual.dni;
  }

  toPrimitives(): any {
    return { ...this.individual };
  }

  getAddress(): Address {
    return {
      streetOne: this.individual.streetOne,
      streetTwo: this.individual.streetTwo,
      postalCode: this.individual.postalCode,
      city: this.individual.city,
      region: this.individual.region,
      country: this.individual.country,
    };
  }
}
