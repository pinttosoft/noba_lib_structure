import { AccountStatus, AccountType, IAccount } from "../../../account";
import { Address, ContactInformation } from "../../../shared";
import { ResidencyStatus } from "../enums/residency_status";
import {
  CommissionForRechargingCard,
  FeeACHPanama,
  FeeAchUsd,
  FeeSwap,
  FeeWire,
} from "../../../system_configuration";
import { CompanyDTO } from "../types/company.type";
import { Documents } from "../../../documents";
import { IndividualDTO } from "../types/Individual.type";
import { KycAction } from "../types/kyc-action.type";
import { InvestmentProfile } from "../types/investment-profile.type";
import { KycProfileType } from "../types/kyc-profile.type";
import { FollowUpClient } from "../types/follow-up-client.type";

export interface IClient {
  getId(): string;

  setAccount(account: IAccount): IClient;

  setAccountId(accountId: string): IClient;

  getAddressShipping(): Address;

  toPrimitives(): any;

  getAccount(): IAccount;

  getClientId(): string;

  getClientType(): AccountType;

  getFirstName(): string;

  getLastName(): string;

  getName(): string;

  getPhoneNumber(): string;

  getCountryPhone(): string;

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

  getFeeACHPanama(): FeeACHPanama;

  getFeeAchUsd(): FeeAchUsd;

  getFeeRechargingCard(): CommissionForRechargingCard;

  getPrincipalDocuments(): Documents[];

  setDocument(dni: string, document: Documents): IClient;

  setStatus(clientStatus: AccountStatus): IClient;

  activeTwoFactorAuth(): void;

  disableTwoFactorAuth(): void;

  updateData(data: IndividualDTO | CompanyDTO): void;

  approveSegregated(): void;

  approveOwnAccount(): void;

  rejectSegregated(): void;

  markAsSendData(): IClient;

  markAsUnderReview(): IClient;

  getKycActions(): KycAction[];

  getClientFollowUp(): FollowUpClient[];

  setKycAction(kycActions: KycAction): IClient;

  setFeeSwap(feeSwap: FeeSwap): IClient;

  setFeeWire(feeWire: FeeWire): IClient;

  setFeeACHPanama(feeACHPanama: FeeACHPanama): IClient;

  setFeeAchUsd(feeAchUsd: FeeAchUsd): IClient;

  deleteKycAction(id: string): void;

  deleteFollowUp(id: string): void;

  setClientFollowUp(clientFollowUp: FollowUpClient): IClient;

  setKycActionToPartner(kycAction: KycAction): IClient;

  deleteKycActionToPartner(kycAction: KycAction): void;

  deleteAllDocumentsPartners(dni: string): void;

  getCompanyPartners(): IndividualDTO[] | undefined;

  getInvestmentProfile(): InvestmentProfile;

  getKYCProfile(): KycProfileType;

  getOccupation(): string;

  getEmploymentStatus(): string;

  setCustomerIdentifierInServiceProvider(
    partnerIdProviderService: string,
    partnerDNI: string,
  ): void;

  getNationality(): string;

  getDocumentExpirationDate(): string;

  build(): void;
}
