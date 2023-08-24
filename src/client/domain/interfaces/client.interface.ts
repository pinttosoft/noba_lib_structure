import { IAccount } from "@/account/domain/interfaces/account.interface";
import { AccountType } from "@/account/domain/enums/account_type.enum";

export interface IClient {
  getId(): string;
  toPrimitives(): any;
  getAccount(): IAccount;
  getClientId(): string;
  getClientType(): AccountType;
  getName(): string;
  getEmail(): string;
}
