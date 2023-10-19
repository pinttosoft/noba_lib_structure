import { AccountStatus, AccountType, IAccount } from "../../../account";
import { Address, ContactInformation } from "../../../shared";
import { ResidencyStatus } from "../enums/residency_status";
import { CompanyType } from "../enums/company_type.enum";
import { FeeSwap, FeeWire } from "../../../system_configuration";
import { CompanyDTO } from "../types/company.type";
import { Documents } from "../../../documents";
import { IndividualDTO } from "../types/Individual.type";

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
  getCompanyToPrimitives(): CompanyDTO;
  getEstablishedDate(): Date;
  getWebSite(): string;
  getStatus(): AccountStatus;
  getFeeSwap(): FeeSwap;
  getFeeWire(): FeeWire;
  setDocument(dni: string, document: Documents): IClient;
  setStatus(clientStatus: AccountStatus): IClient;
  activeTwoFactorAuth(): void;
  disableTwoFactorAuth(): void;
  updateData(data: IndividualDTO | CompanyDTO): void;
}
