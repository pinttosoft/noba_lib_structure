import { AccountType, IAccount } from "../../../account";
import { Address, ContactInformation } from "../../../shared";
import { ResidencyStatus } from "../enums/residency_status";

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
  getTaxId(): string;
  getContactInformation(): ContactInformation;
  getDateOfBirth(): Date;
  getPassportNumber(): string;
  getResidencyStatus(): ResidencyStatus;
}
