import { IAccount } from "@/account/domain/interfaces/account.interface";
import { AccountType } from "@/account/domain/enums/account_type.enum";
import {AddressAndContactData} from "@/shared/domain/types/address_contact_data.type";

export interface IClient {
  getId(): string;
  toPrimitives(): any;
  getAccount(): IAccount;
  getClientId(): string;
  getClientType(): AccountType;
  getName(): string;
  getEmail(): string;
  getIDNumber(): string
  getAddress(): AddressAndContactData
}
