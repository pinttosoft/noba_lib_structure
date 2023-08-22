import { Wallet } from "./abstracts/wallet.abstract";
import { GenericException } from "@/shared/domain/exceptions/generic_exception";
import { IWallet } from "@/wallet";

export class WalletFiat extends Wallet implements IWallet {
  static fromJson(data: any): IWallet {
    const w: WalletFiat = new WalletFiat();
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
    return Number((this.balance - this.lockedBalance).toPrecision(2));
  }

  toPrimitives(): any {
    return {
      walletId: this.walletId,
      assetId: this.getAssetId(),
      walletType: this.walletType,
      clientId: this.clientId,
      balanceAvailable: this.getBalanceAvailable(),
      balance: this.balance,
      lockedBalance: this.lockedBalance,
      label: this.label,
    };
  }
}
