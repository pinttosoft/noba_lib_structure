import { v4 } from "uuid";
import { Address, GenericException } from "../../shared";
import { NetworkBank } from "./enums/network_bank.enum";
import { TypeBankDetails } from "./enums/type_bank_details.enum";
import { Counterparty } from "../../counterparty";
import { CounterpartyBankDTO } from "./types/counterparty_bank.type";

export class CounterpartyBank extends Counterparty {
  private ownerAddress: Address;

  private accountNumber: string;
  private routingNumber?: string;
  private swiftCode?: string;
  private iban?: string;
  private bankName: string;
  private bankAddress: Address;
  private networkBank: NetworkBank;

  static newCounterparty(
    counterpartyBank: CounterpartyBankDTO,
    isInternal: boolean = false,
  ): CounterpartyBank {
    const counterparty: CounterpartyBank = new CounterpartyBank();

    counterparty.assetId = counterpartyBank.assetId;
    counterparty.clientId = counterpartyBank.clientId;
    counterparty.accountId = counterpartyBank.accountId;
    counterparty.ownerName = counterpartyBank.informationOwner.name;
    counterparty.ownerAddress = counterpartyBank.informationOwner.address;
    counterparty.accountNumber = counterpartyBank.accountNumber;

    counterparty.counterpartyType = counterpartyBank.counterpartyType;
    counterparty.isInternal = isInternal;

    if (counterparty.isInternal) {
      counterparty.counterpartyId = counterpartyBank.counterpartyId;
    } else {
      counterparty.counterpartyId = v4();
    }

    if (
      counterpartyBank.informationBank.networkBank === NetworkBank.WIRE ||
      counterpartyBank.informationBank.networkBank === NetworkBank.ACH
    ) {
      counterparty.routingNumber = counterpartyBank.routingNumber;
      if (counterpartyBank.routingNumber === undefined) {
        throw new GenericException("The field routing Number is mandatory");
      }
    } else {
      if (
        counterpartyBank.swiftCode === undefined &&
        counterpartyBank.iban === undefined
      ) {
        throw new GenericException(
          "The fields swiftCode or IBAN are mandatory",
        );
      }
      counterparty.swiftCode = counterpartyBank.swiftCode;
      counterparty.iban = counterpartyBank.iban;
    }

    counterparty.networkBank = counterpartyBank.informationBank.networkBank;
    counterparty.bankAddress = counterpartyBank.informationBank.address;
    counterparty.bankName = counterpartyBank.informationBank.bankName;
    counterparty.createdAt = new Date();

    return counterparty;
  }

  static fromPrimitives(id: string, data: any): CounterpartyBank {
    const counterparty: CounterpartyBank = new CounterpartyBank();
    counterparty.id = id;

    const informationOwner = data.informationOwner;
    const informationBank = data.informationBank;
    counterparty.assetId = data.assetId;

    counterparty.counterpartyId = data.counterpartyId;
    counterparty.ownerName = informationOwner.name;
    counterparty.ownerAddress = { ...informationOwner.address } as Address;
    counterparty.accountNumber = data.accountNumber;
    counterparty.routingNumber = data.routingNumber ?? undefined;
    counterparty.swiftCode = data.swiftCode ?? undefined;
    counterparty.bankAddress = { ...informationBank.address } as Address;

    counterparty.bankName = informationBank.bankName;
    counterparty.accountNumber = informationBank.accountNumber;
    counterparty.networkBank = informationBank.networkBank;

    counterparty.clientId = data.clientId;
    counterparty.accountId = data.accountId;
    counterparty.counterpartyType = data.counterpartyType;
    counterparty.createdAt = data.createdAt;
    counterparty.isInternal = data.isInternal === "S";
    return counterparty;
  }

  getSwiftCode(): string | undefined {
    return this.swiftCode;
  }

  getIban(): string {
    return this.iban;
  }

  getRoutingNumber(): string | undefined {
    return this.routingNumber;
  }

  getAccountNumber(): string {
    return this.accountNumber;
  }

  getInformationBank(): {
    accountNumber: string;
    routingNumber: string | undefined;
    bankName: string;
    networkBank: NetworkBank;
    address: Address;
  } {
    return {
      accountNumber: this.accountNumber,
      bankName: this.bankName,
      networkBank: this.networkBank,
      address: this.bankAddress,
      routingNumber: this.routingNumber,
    };
  }

  getInformationOwner(): { name: string; address: Address } {
    return {
      name: this.ownerName,
      address: this.ownerAddress,
    };
  }

  getName() {
    return this.ownerName;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      assetId: this.assetId,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      swiftCode: this.swiftCode,
      iban: this.iban,
      informationOwner: this.getInformationOwner(),
      informationBank: this.getInformationBank(),
      isInternal: this.isInternal === true ? "S" : "N",
      createdAt: this.createdAt,
    };
  }
}
