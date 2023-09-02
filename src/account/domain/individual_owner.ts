import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { IndividualDTO } from "../../client";

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
}
