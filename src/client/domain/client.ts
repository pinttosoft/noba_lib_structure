import { IClient } from "./interfaces/client.interface";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { AccountType, IAccount } from "../../account";
import { CompanyDTO } from "./types/company.type";
import { IndividualDTO } from "./types/Individual.type";
import { Address, ContactInformation } from "../../shared";

export class Client extends AggregateRoot implements IClient {
  private clientId: string;
  private clientData: any;
  private clientType: AccountType;
  private accountId: string;
  private account: IAccount;
  private id?: string;

  getId(): string {
    return this.id;
  }

  setId(id: string): Client {
    this.id = id;
    return this;
  }

  setAccount(account: IAccount): Client {
    this.account = account;
    return this;
  }

  setClientData(data: any): Client {
    this.clientData = data;
    return this;
  }

  setClientType(clientType: AccountType): Client {
    this.clientType = clientType;
    return this;
  }

  getAccount(): IAccount {
    return this.account;
  }

  build(): void {
    if (this.clientType == AccountType.INDIVIDUAL) {
      this.clientId =
        this.clientData.name.replace(" ", "-") + this.clientData.registerNumber;
    } else {
      this.clientId =
        this.clientData.firstName.substring(0, 1) +
        this.clientData.lastName +
        this.clientData.dni;
    }
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientType(): AccountType {
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

  toPrimitives(): any {
    return {
      clientId: this.clientId,
      ...this.clientData,
      type: this.clientType,
      accountId: this.accountId,
    };
  }
}
