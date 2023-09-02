import { AccountType, IAccount } from "../../../account";
import { Address, ContactInformation } from "../../../shared";

export interface IClient {
  getId(): string;
  toPrimitives(): any;
  getAccount(): IAccount;
  getClientId(): string;
  getClientType(): AccountType;
  getName(): string;
  getEmail(): string;
  getIDNumber(): string;
  getAddress(): Address;
  getContactInformation(): ContactInformation;
}
