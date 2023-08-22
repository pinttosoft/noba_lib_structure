import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { Individual } from "../../client/domain/types/Individual";

export class IndividualOwner implements IOwnerAccount {
  constructor(private readonly individual: Individual) {}

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

  getDNI(): string {
    return this.individual.dni;
  }

  toJson(): any {
    return { ...this.individual };
  }
}
