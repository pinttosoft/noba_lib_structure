import { IAccount } from "@/account/domain/interfaces/account.interface";

export interface IClient {
  toJson(): any;
  getAccount(): IAccount;
}
