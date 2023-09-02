import { IAccount } from "./account.interface";

export interface IAccountRepository {
  findByAccountId(accountId: string): Promise<IAccount | undefined>;
}
