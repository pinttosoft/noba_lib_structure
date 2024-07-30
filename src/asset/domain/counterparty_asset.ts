import {
  Counterparty,
  CounterpartyProfileType,
  CounterpartyType,
} from "../../counterparty";
import { IClient } from "../../client";
import { WalletInformationDTO } from "./types/wallet_information.type";
import { CounterpartyStatus } from "../../counterparty/domain/enums/counterparty_status.enum";
import { WalletType } from "../../wallet";

export class CounterpartyAsset extends Counterparty {
  private walletType: WalletType;
  private informationWallet: WalletInformationDTO;
  private paymentAddress: string;

  static newCounterparty(
    counterpartyId: string,
    client: IClient,
    ownerName: string,
    ownerCountry: string,
    informationWallet: WalletInformationDTO,
    profileType: CounterpartyProfileType,
    status: CounterpartyStatus,
    isInternal: boolean = false,
    walletType: WalletType,
  ): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();

    counterparty.walletType = walletType;
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

    counterparty.status = status;

    return counterparty;
  }

  static fromPrimitives(id: string, data: any): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();
    counterparty.id = id;

    counterparty.walletType = data.walletType ?? WalletType.CRYPTO;
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
    counterparty.status = data.status;
    return counterparty;
  }

  getPaymentAddress(): string {
    return this.paymentAddress;
  }

  getWalletType(): WalletType {
    return this.walletType;
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
      walletType: this.walletType,
      createdAt: this.createdAt,
      status: this.status,
    };
  }
}
