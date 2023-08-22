import { IOwnerAccount } from "@/account/domain/interfaces/owner_account.interface";
import { Company } from "@/client/domain/types/company.type";

export class CompanyOwner implements IOwnerAccount {
  constructor(private readonly company: Company) {}
  getIdentifyNumber(): string {
    return this.company.registerNumber;
  }

  getEmail(): string {
    return this.company.email;
  }

  getName(): string {
    return this.company.name;
  }

  toJson(): any {
    return { ...this.company };
  }
}
