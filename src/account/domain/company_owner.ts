import { IOwnerAccount } from "@/account/domain/interfaces/owner_account.interface";
import { Company } from "@/client/domain/types/company";

export class CompanyOwner implements IOwnerAccount {
  constructor(private readonly company: Company) {}
  getDNI(): string {
    return "";
  }

  getEmail(): string {
    return "";
  }

  getName(): string {
    return "";
  }

  toJson(): any {
    return { ...this.company };
  }
}
