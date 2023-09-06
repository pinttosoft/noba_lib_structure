import { IClient } from "../../client";
import { v4 } from "uuid";
import { Address } from "../../shared";
import { NetworkBank } from "./enums/network_bank.enum";
import { TypeBankDetails } from "./enums/type_bank_details.enum";
import { Counterparty } from "../../counterparty";

export class CounterpartyBank extends Counterparty {
  private ownerAddress: Address;

  private accountNumber: string;
  private routingNumber?: string;
  private swiftCode?: string;
  private bankName: string;
  private bankAddress: Address;
  private networkBank: NetworkBank;
  private typeBankDetails: TypeBankDetails;

  static newCounterparty(
    client: IClient,
    ownerName: string,
    ownerAddress: Address,
    accountNumber: string,
    swiftCodeOrRoutingNumber: string,
    networkBank: NetworkBank,
    bankAddress: Address,
    bankName: string,
    typeBankDetails: TypeBankDetails,
  ): CounterpartyBank {
    const counterparty: CounterpartyBank = new CounterpartyBank();

    counterparty.counterpartyId = v4();
    counterparty.clientId = client.getClientId();
    counterparty.ownerName = ownerName;
    counterparty.ownerAddress = ownerAddress;
    counterparty.accountNumber = accountNumber;
    counterparty.typeBankDetails = typeBankDetails;

    counterparty.counterpartyType = "FIAT_" + bankAddress.country;

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

  static fromPrimitives(id: string, data: any): CounterpartyBank {
    const counterparty: CounterpartyBank = new CounterpartyBank();

    const informationOwner = data.informationOwner;
    const informationBank = data.informationBank;

    counterparty.counterpartyId = data.counterpartyId;
    counterparty.ownerName = informationOwner.name;
    counterparty.ownerAddress = { ...informationOwner.address } as Address;
    counterparty.accountNumber = data.accountNumber;
    counterparty.routingNumber = data.routingNumber ?? undefined;
    counterparty.swiftCode = data.swiftCode ?? undefined;
    counterparty.bankAddress = { ...informationBank.address } as Address;

    counterparty.bankName = informationBank.bankName;
    counterparty.networkBank = informationBank.networkBank;
    counterparty.typeBankDetails = informationBank.typeBankDetails;

    counterparty.clientId = data.clientId;
    counterparty.accountId = data.accountId;
    counterparty.counterpartyType = data.counterpartyType;

    return counterparty;
  }

  getSwiftCode(): string | undefined {
    return this.swiftCode;
  }

  getRoutingNumber(): string | undefined {
    return this.routingNumber;
  }

  getInformationBank(): {
    type: TypeBankDetails;
    accountNumber: string;
    bankName: string;
    networkBank: string;
    address: Address;
  } {
    return {
      accountNumber: this.accountNumber,
      type: this.typeBankDetails,
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

  toPrimitives(): any {
    return {
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      routingNumber: this.routingNumber,
      swiftCode: this.swiftCode,
      informationOwner: this.getInformationOwner(),
      informationBank: this.getInformationBank(),
    };
  }
}
