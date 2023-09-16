import { Counterparty, CounterpartyType } from "../../counterparty";
import { v4 } from "uuid";
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
  ): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();

    counterparty.counterpartyId = counterpartyId;
    counterparty.paymentAddress = informationWallet.address;
    counterparty.clientId = client.getClientId();
    counterparty.accountId = client.getAccount().getAccountId();
    counterparty.ownerName = ownerName;
    counterparty.ownerCountry = ownerCountry;
    counterparty.counterpartyType = CounterpartyType.CRYPTO;
    counterparty.informationWallet = informationWallet;
    counterparty.assetId = informationWallet.assetId;
    counterparty.relationshipConsumer = informationWallet.relationshipConsumer;
    counterparty.createdAt = new Date();

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

  toPrimitives(): any {
    return {
      id: this.id,
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      informationOwner: this.getInformationOwner(),
      informationWallet: this.informationWallet,
      createdAt: this.createdAt,
    };
  }
}
