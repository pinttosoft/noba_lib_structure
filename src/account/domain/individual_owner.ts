import { IOwnerAccount } from "@/account";
import { Individual } from "@/client/domain/types/Individual.type";

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

  getIdentifyNumber(): string {
    return this.individual.dni;
  }

  toJson(): any {
    return { ...this.individual };
  }
}
