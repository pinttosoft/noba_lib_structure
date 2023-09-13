import { IClient } from "../../../client";
import { IWallet, WalletType, Wallet } from "../../../wallet";
import { GenericException } from "../../../shared";
import { Asset } from "../../../asset";

export class WalletFactory {
  static createNewWallet(
    asset: Asset,
    client: IClient,
    type: WalletType,
  ): IWallet {
    const w: Wallet = new Wallet();

    w.setAssetId(asset.getAssetId())
      .setClient(client)
      .setWalletType(type)
      .build();

    return w;
  }

  static fromPrimitives(id: string, data: any, client: IClient): IWallet {
    const w: Wallet = new Wallet();

    try {
      w.setId(id)
        .setWalletId(data.walletId)
        .setWalletType(data.walletType)
        .setAssetId(data.assetId)
        .setClient(client)
        .setBalance(data.balance)
        .setInstructionForDeposit(data.instructionForDeposit)
        .setLockedBalance(data.lockedBalance);
    } catch (e) {
      throw new GenericException(e.message);
    }

    return w;
  }
}
