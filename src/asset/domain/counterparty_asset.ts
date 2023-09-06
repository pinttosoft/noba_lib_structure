import { Counterparty, CounterpartyType } from "../../counterparty";
import { v4 } from "uuid";
import { IClient } from "../../client";
import { WalletInformationDTO } from "./types/wallet_information.type";
import { Address } from "../../shared";

export class CounterpartyAsset extends Counterparty {
  private ownerCountry: string;
  private informationWallet: WalletInformationDTO;

  static newCounterparty(
    client: IClient,
    ownerName: string,
    ownerCountry: string,
    informationWallet: WalletInformationDTO,
  ): CounterpartyAsset {
    const counterparty: CounterpartyAsset = new CounterpartyAsset();

    counterparty.counterpartyId = v4();
    counterparty.clientId = client.getClientId();
    counterparty.ownerName = ownerName;
    counterparty.ownerCountry = ownerCountry;
    counterparty.counterpartyType = CounterpartyType.CRYPTO;
    counterparty.informationWallet = informationWallet;

    return counterparty;
  }

  getInformationWallet(): WalletInformationDTO {
    return this.informationWallet;
  }

  getInformationOwner(): { name: string; country: string } {
    return {
      name: this.ownerName,
      country: this.ownerCountry,
    };
  }
  toPrimitives(): any {
    return {
      clientId: this.clientId,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      accountId: this.accountId,
      informationOwner: this.getInformationOwner(),
      informationWallet: this.getInformationWallet(),
    };
  }
}
