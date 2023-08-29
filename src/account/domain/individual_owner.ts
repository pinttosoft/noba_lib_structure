import { IOwnerAccount } from "@/account";
import { IndividualDTO } from "@/client/domain/types/Individual.type";

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
