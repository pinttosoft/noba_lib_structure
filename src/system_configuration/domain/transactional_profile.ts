import { AccountType } from "../../account";
import { TransactionalProfileType } from "../../client/domain/types/transactional-profile.type";

export class TransactionalProfile {
  company: TransactionalProfileType;
  natural_person: TransactionalProfileType;

  static fromPrimitives(data: any, type: AccountType): TransactionalProfile {
    const c: TransactionalProfile = new TransactionalProfile();
    if (type === AccountType.COMPANY) {
      c.company = data;
    }
    if (type === AccountType.INDIVIDUAL) {
      c.natural_person = data;
    }
    return c;
  }

  getCompany() {
    return this.company;
  }

  getPerson() {
    return this.natural_person;
  }

  toPrimitives(): any {
    return {
      company: this.company,
      natural_person: this.natural_person,
    };
  }
}
