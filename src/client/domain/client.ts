import { IClient } from "./interfaces/client.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import {
  AccountStatus,
  AccountType,
  IAccount,
  IOwnerAccount,
} from "../../account";
import { CompanyDTO } from "./types/company.type";
import { IndividualDTO } from "./types/Individual.type";
import { Address, ContactInformation, GenericException } from "../../shared";
import { InvalidMethodForClientType } from "./exceptions/invalid_method_client_type";
import { ResidencyStatus } from "./enums/residency_status";
import { FeeSwap, FeeWire } from "../../system_configuration";
import { Documents } from "../../documents";
import * as process from "process";
import { KycAction } from "../../account/domain/types/kyc-action.type";

export class Client extends AggregateRoot implements IClient {
  private clientId: string;
  private clientData: any;
  private clientType: AccountType;
  private account: IAccount;
  private id?: string;
  private isSegregated?: boolean;
  private kycRequestedChanges?: KycAction[] = [];
  private accountId: string;
  private taxId?: string;
  private status: AccountStatus;
  private feeSwap?: FeeSwap;
  private feeWire?: FeeWire;
  private documents: Documents[] = [];
  private companyPartners: IOwnerAccount[] = [];
  private twoFactorActive: boolean = false;
  private createdAt: Date;
  private approvedAt: Date;

  getId(): string {
    return this.id;
  }

  setStatus(clientStatus: AccountStatus): Client {
    this.status = clientStatus;
    return this;
  }

  setTaxId(taxId?: string): Client {
    this.taxId = taxId;
    return this;
  }

  setClientId(clientId: string): Client {
    this.clientId = clientId;
    return this;
  }

  setId(id: string): Client {
    this.id = id;
    return this;
  }

  setAccount(account: IAccount): Client {
    this.account = account;
    return this;
  }

  setFeeWire(fee: FeeWire): Client {
    this.feeWire = fee;
    return this;
  }

  setFeeSwap(fee: FeeSwap): Client {
    this.feeSwap = fee;
    return this;
  }

  setClientData(data: any): Client {
    this.clientData = data;

    return this;
  }

  setDocument(dni: string, document: Documents): Client {
    if (dni === this.getIDNumber()) {
      if (this.documents && this.documents.length > 0) {
        this.documents.push(document);
      } else {
        this.documents = [document];
      }

      return;
    }

    if (!this.companyPartners || this.companyPartners.length === 0) {
      throw new GenericException("Company partners not found");
    }

    const partner: IOwnerAccount = this.companyPartners.find(
      (p: IOwnerAccount): boolean => p.getIdentifyNumber() === dni,
    );

    if (partner) {
      partner.setDocument(document);
    }

    return this;
  }

  setClientType(clientType: AccountType): Client {
    this.clientType = clientType;
    return this;
  }

  setCompanyPartners(partners: IOwnerAccount[]): Client {
    this.companyPartners = partners;
    return this;
  }

  setCreatedAt(date: Date): Client {
    this.createdAt = date;
    return this;
  }

  setApprovedAt(date: Date): Client {
    this.approvedAt = date;
    return this;
  }

  getTaxId(): string {
    return this.taxId;
  }

  getStatus(): AccountStatus {
    return this.status;
  }

  getAccount(): IAccount {
    return this.account;
  }

  build(): void {
    if (this.clientType == AccountType.COMPANY) {
      this.clientId =
        this.clientData.informationCompany.name.replace(" ", "-") +
        this.clientData.informationCompany.registerNumber;
    } else {
      this.clientId =
        this.clientData.firstName.substring(0, 1) +
        this.clientData.lastName.replace(" ", "-") +
        this.clientData.dni;
    }
  }

  getCompanyToPrimitives(): CompanyDTO {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getCompanyToPrimitives",
      );
    }
    return this.clientData as CompanyDTO;
  }

  getNaics(): { code: string; description: string } {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType, "getNaics");
    }
    return {
      code: this.clientData.naics,
      description: this.clientData.naicsDescription,
    };
  }

  getEstablishedDate(): Date {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getEstablishedDate",
      );
    }
    return this.clientData.established_date;
  }

  getWebSite(): string {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType, "getWebSite");
    }
    return this.clientData.webSite;
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientType(): AccountType {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType, "getClientType");
    }
    return this.clientType;
  }

  getName(): string {
    if (this.clientType == AccountType.INDIVIDUAL) {
      return (
        this.clientData.firstName +
        " " +
        this.clientData.middleName +
        " " +
        this.clientData.lastName
      );
    }

    return this.clientData.name;
  }

  getEmail(): string {
    return this.clientData.email;
  }

  getIDNumber(): string {
    if (this.clientType === AccountType.COMPANY) {
      return (this.toPrimitives() as CompanyDTO).informationCompany
        .registerNumber;
    } else {
      return (this.toPrimitives() as IndividualDTO).dni;
    }
  }

  getAddress(): Address {
    const d = this.toPrimitives();
    if (this.clientType === AccountType.COMPANY) {
      return (this.toPrimitives() as CompanyDTO).informationCompany
        .physicalAddress;
    }

    return {
      streetOne: d.streetOne,
      streetTwo: d.streetTwo,
      postalCode: d.postalCode,
      city: d.city,
      region: d.region,
      country: d.country,
    };
  }

  getContactInformation(): ContactInformation {
    const d = this.toPrimitives();

    return {
      phoneCountry: d.phoneCountry,
      phoneNumber: d.phoneNumber,
      email: d.email,
    };
  }

  getPassportNumber(): string {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getPassportNumber",
      );
    }
    return this.clientData.passport;
  }

  getDateOfBirth(): Date {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType, "getDateOfBirth");
    }

    return this.clientData.dateBirth;
  }
  getResidencyStatus(): ResidencyStatus {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(
        this.clientType,
        "getResidencyStatus",
      );
    }

    return this.clientData.residencyStatus;
  }

  getFeeSwap(): FeeSwap {
    return this.feeSwap;
  }

  getFeeWire(): FeeWire {
    return this.feeWire;
  }

  activeTwoFactorAuth(): void {
    this.twoFactorActive = true;
  }

  disableTwoFactorAuth(): void {
    this.twoFactorActive = false;
  }

  updateData(data: IndividualDTO | CompanyDTO): void {
    this.clientData = data;
    delete this.clientData.password;
    delete this.clientData._id;
  }

  markAsSendData(): IClient {
    this.status = AccountStatus.SUBMITTED;
    return this;
  }

  markAsUnderReview(): IClient {
    this.status = AccountStatus.PROCESSING;
    return this;
  }

  approveSegregated(): void {
    this.status = AccountStatus.APPROVED;
    this.setApprovedAt(new Date());

    this.accountId = process.env.PINTTOSOFT_ACCOUNT;
    this.isSegregated = true;
  }

  rejectSegregated(): void {
    this.status = AccountStatus.REJECTED;
  }

  getKycAction(): KycAction[] {
    return this.kycRequestedChanges;
  }

  setKycAction(kycAction: KycAction[]): void {
    this.kycRequestedChanges.push(...kycAction);
  }

  toPrimitives(): any {
    return {
      isSegregated: this.isSegregated,
      clientId: this.clientId,
      ...this.clientData,
      type: this.clientType,
      accountId: this.accountId,
      status: this.status,
      feeSwap: this.feeSwap.toPrimitives(),
      feeWire: this.feeWire.toPrimitives(),
      documents: this.documents.map((d: Documents) => d.toPrimitives()),
      twoFactorActive: this.twoFactorActive,
      createdAt: this.createdAt,
      approvedAt: this.approvedAt,
      kycRequestedChanges: this.kycRequestedChanges,
    };
  }
}
