import { TransactionalProfileType } from "../../client/domain/types/transactional-profile.type";

export class TransactionalProfile {
  maximumWithdrawalPerTransaction: number;
  maximumMonthlyWithdrawal: number;

  static fromPrimitives(data: TransactionalProfileType): TransactionalProfile {
    const c: TransactionalProfile = new TransactionalProfile();
    c.maximumWithdrawalPerTransaction = data.maximumWithdrawalPerTransaction;
    c.maximumMonthlyWithdrawal = data.maximumMonthlyWithdrawal;
    return c;
  }

  toPrimitives(): any {
    return {
      maximumWithdrawalPerTransaction: this.maximumWithdrawalPerTransaction,
      maximumMonthlyWithdrawal: this.maximumMonthlyWithdrawal,
    };
  }
}
