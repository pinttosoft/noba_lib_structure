import { IAccount } from "./account.interface";

export interface IAccountRepository {
  findByAccountId(accountId: string): Promise<IAccount | undefined>;
  findAccountByOwnerEmail(email: string): Promise<IAccount | undefined>;
  findAccountByApplicationId(
    applicationId: string,
  ): Promise<IAccount | undefined>;
  upsert(account: IAccount): Promise<void>;
}
