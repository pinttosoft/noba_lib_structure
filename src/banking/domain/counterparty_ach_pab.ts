import { Counterparty } from "../../counterparty";
import { InstructionsAchPabType } from "./types/instructions_ach_pab.type";
import { CounterpartyAchPabDtoType } from "./types/counterparty_ach_pab_dto.type";
import { Address } from "../../shared";

export class CounterpartyAchPab extends Counterparty {
  private achInstructions: InstructionsAchPabType;

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
    c.accountId = data.accountId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;
    c.achInstructions = data.achInstructions;

    c.setOwnerName(data.informationOwner.name);
    c.ownerCountry = data.informationOwner.address.country;

    return c;
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
    c.accountId = data.accountId;
    c.counterpartyType = data.counterpartyType;
    c.counterpartyId = data.counterpartyId;
    c.counterpartyType = data.counterpartyType;
    c.assetId = data.assetId;
    c.createdAt = new Date();
    c.status = data.status;
    c.achInstructions = data.achInstructions;

    c.ownerName = informationOwner.name;
    c.ownerCountry = data.informationOwner.country;

    return c;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      assetId: this.assetId,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      achInstructions: this.achInstructions,
      informationOwner: this.getInformationOwner(),
      isInternal: this.isInternal === true ? "S" : "N",
      createdAt: this.createdAt,
      status: this.status,
    };
  }
}
