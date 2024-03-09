import { Counterparty } from "../../counterparty";
import { CounterpartyAchPabDtoType } from "./types/counterparty_ach_pab_dto.type";
import { Address } from "../../shared";

export class CounterpartyAchPab extends Counterparty {
  private label: string;
  private holderEmail: string;
  private accountDestinationNumber: string;
  private bankName: string;
  private productType: string;
  private holderId: string;
  private holderName: string;

  getName(): string {
    return "";
  }

  getId(): string | undefined {
    return this.id;
  }

  static newCounterparty(
    data: CounterpartyAchPabDtoType,
    isInternal: boolean = false,
  ): CounterpartyAchPab {
    const c: CounterpartyAchPab = new CounterpartyAchPab();
    c.isInternal = isInternal;
    c.clientId = data.clientId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;

    c.label = data.achInstructions.label;
    c.holderEmail = data.achInstructions.holderEmail;
    c.accountDestinationNumber = data.achInstructions.accountDestinationNumber;
    c.bankName = data.achInstructions.bankName;
    c.productType = data.achInstructions.productType;
    c.holderId = data.achInstructions.holderId;
    c.holderName = data.achInstructions.holderName;

    c.setOwnerName(data.informationOwner.name);
    c.ownerCountry = data.informationOwner.address
      ? data.informationOwner.address.country
      : undefined;

    return c;
  }

  getInformationBank() {
    return {
      label: this.label,
      holderEmail: this.holderEmail,
      accountDestinationNumber: this.accountDestinationNumber,
      bankName: this.bankName,
      productType: this.productType,
      holderId: this.holderId,
      holderName: this.holderName,
    };
  }

  getInformationOwner():
    | { name: string; address: Address }
    | { name: string; country: string } {
    return {
      name: this.ownerName,
      address: {
        streetOne: "",
        streetTwo: "",
        postalCode: "",
        city: "",
        region: "",
        country: this.ownerCountry,
      },
    };
  }

  static fromPrimitives(id: string, data: any): CounterpartyAchPab {
    const c: CounterpartyAchPab = new CounterpartyAchPab();
    const informationOwner = data.informationOwner;

    c.id = id;
    c.isInternal = data.isInternal;
    c.clientId = data.clientId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;

    c.ownerName = informationOwner.name;
    c.ownerCountry = data.informationOwner.country;

    c.label = data.informationBank.label;
    c.holderEmail = data.informationBank.holderEmail;
    c.accountDestinationNumber = data.informationBank.accountDestinationNumber;
    c.bankName = data.informationBank.bankName;
    c.productType = data.informationBank.productType;
    c.holderId = data.informationBank.holderId;
    c.holderName = data.informationBank.holderName;

    return c;
  }

  toPrimitives(): any {
    return {
      informationBank: this.getInformationBank(),
      assetId: this.assetId,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      informationOwner: this.getInformationOwner(),
      isInternal: this.isInternal === true ? "S" : "N",
      createdAt: this.createdAt,
      status: this.status,
    };
  }
}
