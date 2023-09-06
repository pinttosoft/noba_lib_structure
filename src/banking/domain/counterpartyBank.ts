import { v4 } from "uuid";
import { Address } from "../../shared";
import { NetworkBank } from "./enums/network_bank.enum";
import { TypeBankDetails } from "./enums/type_bank_details.enum";
import { Counterparty } from "../../counterparty";
import { CounterpartyBankDTO } from "./types/counterparty_bank.type";

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
    counterpartyBank: CounterpartyBankDTO,
  ): CounterpartyBank {
    const counterparty: CounterpartyBank = new CounterpartyBank();

    counterparty.counterpartyId = v4();
    counterparty.clientId = counterpartyBank.clientId;
    counterparty.accountId = counterpartyBank.accountId;
    counterparty.ownerName = counterpartyBank.informationOwner.name;
    counterparty.ownerAddress = counterpartyBank.informationOwner.address;
    counterparty.accountNumber = counterpartyBank.accountNumber;
    counterparty.typeBankDetails = counterpartyBank.informationBank.type;

    counterparty.counterpartyType =
      "FIAT_" + counterpartyBank.informationBank.address.country;

    if (counterpartyBank.informationBank.networkBank === NetworkBank.WIRE) {
      counterparty.routingNumber = counterpartyBank.swiftCode;
    } else {
      counterparty.swiftCode = counterpartyBank.routingNumber;
    }

    counterparty.networkBank = counterpartyBank.informationBank.networkBank;
    counterparty.bankAddress = counterpartyBank.informationBank.address;
    counterparty.bankName = counterpartyBank.informationBank.bankName;

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
