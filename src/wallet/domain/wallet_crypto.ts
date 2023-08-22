import { Asset } from "@/asset/domain/asset";
import { IClient } from "@/client";
import { Wallet } from "@/wallet/domain/abstracts/wallet.abstract";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";
import { IWallet } from "@/wallet/domain/interfaces/wallet.interface";

export class WalletCrypto extends Wallet implements IWallet {
  static fromJson(data: any): IWallet {
    const w = new WalletCrypto();
    w.walletId = data.walletId ?? undefined;

    try {
      w.setAssetId(data.assetId);
      w.clientId = data.clientId;
      w.label = data.label;
      w.balance = data.balance;
      w.lockedBalance = data.lockedBalance;
    } catch (e) {
      throw new GenericException(e.message);
    }

    return w;
  }

  getBalanceAvailable(): number {
    return Number((this.balance - this.lockedBalance).toPrecision(6));
  }

  toPrimitives(): any {
    return {
      ...this,
    };
  }
}
