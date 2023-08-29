import { Asset } from "@/asset/domain/asset";
import { IClient } from "@/client";
import { IWallet } from "@/wallet/domain/interfaces/wallet.interface";
import { WalletType } from "@/wallet/domain/enums/wallet_type";
import { Wallet } from "@/wallet/domain/wallet";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";

export class WalletFactory {
  static createNewWallet(
    label: string,
    asset: Asset,
    client: IClient,
    type: WalletType,
  ): IWallet {
    const w: Wallet = new Wallet();

    w.setAsset(asset)
      .setClient(client)
      .setLabel(label)
      .setWalletType(type)
      .build();

    return w;
  }

  static fromPrimitives(id: string, data: any): IWallet {
    const w: Wallet = new Wallet();

    try {
      w.setId(id)
        .setWalletId(data.walletId)
        .setWalletType(data.walletType)
        .setAssetId(data.assetId)
        .setClientId(data.clientId)
        .setLabel(data.label)
        .setBalance(data.balance)
        .setLockedBalance(data.lockedBalance);
    } catch (e) {
      throw new GenericException(e.message);
    }

    return w;
  }
}
