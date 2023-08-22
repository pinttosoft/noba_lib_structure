import { Asset } from "@/asset/domain/asset";
import { IClient } from "@/client";
import { IWallet } from "@/wallet/domain/interfaces/wallet.interface";
import { WalletType } from "@/wallet/domain/enums/wallet_type";
import { WalletFiat } from "@/wallet/domain/wallet_fiat";
import { Wallet } from "@/wallet/domain/abstracts/wallet.abstract";
import { WalletCrypto } from "@/wallet/domain/wallet_crypto";

export class WalletFactory {
  static createNewWallet(
    label: string,
    asset: Asset,
    client: IClient,
    type: WalletType,
  ): IWallet {
    let w: Wallet;

    if (type === WalletType.FIAT) {
      w = new WalletFiat();
    } else {
      w = new WalletCrypto();
    }

    w.setAsset(asset)
      .setClient(client)
      .setLabel(label)
      .setWalletType(WalletType.FIAT);

    return w;
  }
}
