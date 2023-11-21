import {
  Counterparty,
  CounterpartyProfileType,
  CounterpartyType,
} from "../../counterparty";
import { IClient } from "../../client";
import { WalletInformationDTO } from "./types/wallet_information.type";

export class CounterpartyAsset extends Counterparty {
  private informationWallet: WalletInformationDTO;
  private paymentAddress: string;

  static newCounterparty(
    counterpartyId: string,
    client: IClient,
    ownerName: string,
    ownerCountry: string,
    informationWallet: WalletInformationDTO,
    profileType: CounterpartyProfileType,
    isInternal: boolean = false,
  ): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();

    counterparty.counterpartyId = counterpartyId;
    counterparty.paymentAddress = informationWallet.address;
    counterparty.clientId = client.getClientId();
    counterparty.accountId = client.getAccount().getAccountId();
    counterparty.setOwnerName(ownerName);
    counterparty.ownerCountry = ownerCountry;
    counterparty.counterpartyType = CounterpartyType.CRYPTO;
    counterparty.informationWallet = informationWallet;
    counterparty.assetId = informationWallet.assetId;
    counterparty.relationshipConsumer = informationWallet.relationshipConsumer;
    counterparty.createdAt = new Date();
    counterparty.isInternal = isInternal;
    counterparty.profileType = profileType;

    return counterparty;
  }

  static fromPrimitives(id: string, data: any): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();
    counterparty.id = id;

    counterparty.clientId = data.clientId;
    counterparty.ownerName = data.informationOwner.name;
    counterparty.ownerCountry = data.informationOwner.country;
    counterparty.counterpartyType = CounterpartyType.CRYPTO;
    counterparty.informationWallet = data.informationWallet;
    counterparty.assetId = data.informationWallet.assetId;
    counterparty.counterpartyId = data.counterpartyId;

    counterparty.relationshipConsumer =
      data.informationWallet.relationshipConsumer;
    counterparty.createdAt = data.createdAt;

    counterparty.isInternal = data.isInternal === "S";
    counterparty.assetId = data.assetId;
    counterparty.profileType = data.profileType ?? "";
    return counterparty;
  }

  getPaymentAddress(): string {
    return this.paymentAddress;
  }

  getInformationOwner(): { name: string; country: string } {
    return {
      name: this.ownerName,
      country: this.ownerCountry,
    };
  }

  getInformationWallet(): WalletInformationDTO {
    return this.informationWallet;
  }

  getName(): string {
    return this.ownerName;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      assetId: this.informationWallet.assetId,
      informationOwner: this.getInformationOwner(),
      informationWallet: this.informationWallet,
      isInternal: this.isInternal === true ? "S" : "N",
      createdAt: this.createdAt,
    };
  }
}
