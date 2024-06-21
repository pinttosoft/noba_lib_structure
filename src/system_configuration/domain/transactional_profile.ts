import { AccountType } from "../../account";

export class TransactionalProfile {
  private id?: string;
  company: {
    maximumWithdrawalPerTransaction: number;
    maximumMonthlyWithdrawal: number;
  };
  natural_person: {
    maximumWithdrawalPerTransaction: number;
    maximumMonthlyWithdrawal: number;
  };

  getId(): string {
    return this.id;
  }

  static fromPrimitives(data: any, type: string): TransactionalProfile {
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
