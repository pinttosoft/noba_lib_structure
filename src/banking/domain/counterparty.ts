import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { IClient } from "../../client";
import { v4 } from "uuid";
import { Address } from "../../shared";
import { NetworkBank } from "./enums/network_bank.enum";
import { CounterpartyDTO } from "./types/counterparty.type";

export class Counterparty extends AggregateRoot {
  private id?: string;
  private counterpartyId: string;
  private clientId: string;
  private accountId: string;

  private ownerName: string;
  private ownerAddress: Address;

  private accountNumber: string;
  private routingNumber?: string;
  private swiftCode?: string;
  private bankName: string;
  private bankAddress: Address;
  private networkBank: NetworkBank;

  static newCounterparty(
    client: IClient,
    ownerName: string,
    ownerAddress: Address,
    accountNumber: string,
    swiftCodeOrRoutingNumber: string,
    networkBank: NetworkBank,
    bankAddress: Address,
    bankName: string,
  ): Counterparty {
    const counterparty: Counterparty = new Counterparty();

    counterparty.counterpartyId = v4();
    counterparty.clientId = client.getClientId();
    counterparty.ownerName = ownerName;
    counterparty.ownerAddress = ownerAddress;
    counterparty.accountNumber = accountNumber;

    if (networkBank === NetworkBank.WIRE) {
      counterparty.routingNumber = swiftCodeOrRoutingNumber;
    } else {
      counterparty.swiftCode = swiftCodeOrRoutingNumber;
    }

    counterparty.networkBank = networkBank;
    counterparty.bankAddress = bankAddress;
    counterparty.bankName = bankName;
    counterparty.accountId = client.getAccount().getAccountId();

    return counterparty;
  }

  static fromPrimitives(id: string, data: any): Counterparty {
    const counterparty: Counterparty = new Counterparty();

    const informationOwner = data.informationOwner;
    const informationBank = data.informationBank;

    counterparty.counterpartyId = v4();
    counterparty.ownerName = informationOwner.name;
    counterparty.ownerAddress = { ...informationOwner.address } as Address;
    counterparty.accountNumber = data.accountNumber;
    counterparty.routingNumber = data.routingNumber ?? undefined;
    counterparty.swiftCode = data.swiftCode ?? undefined;
    counterparty.bankAddress = { ...informationBank.address } as Address;
    counterparty.bankName = informationBank.bankName;
    counterparty.networkBank = informationBank.networkBank;
    counterparty.clientId = data.clientId;
    counterparty.accountId = data.accountId;

    return counterparty;
  }

  getId(): string | undefined {
    return this.id;
  }

  getAccountId() {
    return this.accountId;
  }

  getSwiftCode(): string | undefined {
    return this.swiftCode;
  }

  getRoutingNumber(): string | undefined {
    return this.routingNumber;
  }

  getInformationBank(): {
    bankName: string;
    networkBank: string;
    address: Address;
  } {
    return {
      bankName: this.bankName,
      networkBank: this.networkBank,
      address: this.bankAddress,
    };
  }

  getInformationOwner(): { name: string; address: Address } {
    return {
      name: this.ownerName,
      address: this.ownerAddress,
    };
  }

  toPrimitives(): CounterpartyDTO {
    return {
      clientId: this.clientId,
      accountId: this.accountId,
      routingNumber: this.routingNumber,
      swiftCode: this.swiftCode,
      informationOwner: this.getInformationOwner(),
      informationBank: this.getInformationBank(),
    };
  }
}
