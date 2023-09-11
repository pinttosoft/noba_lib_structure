import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { CompanyDTO } from "../../client";
import { Address } from "../../shared";

export class CompanyOwner implements IOwnerAccount {
  constructor(private readonly company: CompanyDTO) {}

  getAddress(): Address {
    return this.company.physicalAddress;
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
