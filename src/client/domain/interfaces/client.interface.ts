import { AccountType, IAccount } from "../../../account";
import { Address, ContactInformation } from "../../../shared";
import { ResidencyStatus } from "../enums/residency_status";
import { CompanyType } from "../enums/company_type.enum";

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
  getNaics(): { code: string; description: string };
  getCompanyType(): CompanyType;
  getEstablishedDate(): Date;
}
