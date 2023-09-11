import { IClient } from "./interfaces/client.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { AccountStatus, AccountType, IAccount } from "../../account";
import { CompanyDTO } from "./types/company.type";
import { IndividualDTO } from "./types/Individual.type";
import { Address, ContactInformation, GenericException } from "../../shared";
import { InvalidMethodForClientType } from "./exceptions/invalid_method_client_type";
import { ResidencyStatus } from "./enums/residency_status";
import { CompanyType } from "./enums/company_type.enum";
import { FeeSwap, FeeWire } from "../../system_configuration";

export class Client extends AggregateRoot implements IClient {
  private clientId: string;
  private clientData: any;
  private clientType: AccountType;
  private accountId: string;
  private account: IAccount;
  private id?: string;
  private taxId?: string;
  private status: AccountStatus;
  private feeSwap?: FeeSwap;
  private feeWire?: FeeWire;

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
    if (this.clientType === AccountType.COMPANY && !("naics" in data)) {
      throw new GenericException("Field naics is mandatory");
    }

    if (
      this.clientType === AccountType.COMPANY &&
      !("corporate_entity_type" in data)
    ) {
      throw new GenericException("Field corporate_entity_type is mandatory");
    }

    if (
      this.clientType === AccountType.COMPANY &&
      !("established_date" in data)
    ) {
      throw new GenericException("Field established_date is mandatory");
    }

    this.clientData = data;

    return this;
  }

  setClientType(clientType: AccountType): Client {
    this.clientType = clientType;
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
        this.clientData.name.replace(" ", "-") + this.clientData.registerNumber;
    } else {
      this.clientId =
        this.clientData.firstName.substring(0, 1) +
        this.clientData.lastName +
        this.clientData.dni;
    }
  }

  getCompanyType(): CompanyType {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType);
    }
    return this.clientData.companyType;
  }

  getNaics(): { code: string; description: string } {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType);
    }
    return {
      code: this.clientData.naics,
      description: this.clientData.naicsDescription,
    };
  }

  getEstablishedDate(): Date {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType);
    }
    return this.clientData.established_date;
  }

  getWebSite(): string {
    if (this.clientType === AccountType.INDIVIDUAL) {
      throw new InvalidMethodForClientType(this.clientType);
    }
    return this.clientData.webSite;
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientType(): AccountType {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType);
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
      return (this.toPrimitives() as CompanyDTO).registerNumber;
    } else {
      return (this.toPrimitives() as IndividualDTO).passport;
    }
  }

  getAddress(): Address {
    const d = this.toPrimitives();
    if (this.clientType === AccountType.COMPANY) {
      return (this.toPrimitives() as CompanyDTO).physicalAddress;
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
      throw new InvalidMethodForClientType(this.clientType);
    }
    return this.clientData.passport;
  }

  getDateOfBirth(): Date {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType);
    }

    return this.clientData.dateBirth;
  }
  getResidencyStatus(): ResidencyStatus {
    if (this.clientType === AccountType.COMPANY) {
      throw new InvalidMethodForClientType(this.clientType);
    }

    return this.clientData.residencyStatus;
  }

  getFeeSwap(): FeeSwap {
    return this.feeSwap;
  }

  getFeeWire(): FeeWire {
    return this.feeWire;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      clientId: this.clientId,
      ...this.clientData,
      type: this.clientType,
      accountId: this.accountId,
      taxId: this.taxId ?? "",
      status: this.status,
      feeSwap: this.feeSwap.toPrimitives(),
      feeWire: this.feeWire.toPrimitives(),
    };
  }
}
