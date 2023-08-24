import { IAccount } from "@/account";

export interface IAccountRepository {
  findByAccountId(accountId: string): Promise<IAccount | undefined>;
}
