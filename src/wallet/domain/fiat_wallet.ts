import { Wallet } from "./wallet";
import { IWallet } from "./interfaces/wallet.interface";
import { WalletType } from "./enums/wallet_type";

export class FiatWallet extends Wallet implements IWallet {
  constructor(clientId: string, label: string) {
    super();
    this.clientId = clientId;
    this.label = label;
    this.walletType = WalletType.FIAT;
  }

  getBalanceAvailable(): number {
    return Number((this.balance - this.lockedBalance).toFixed(2));
  }

  toJson(): any {
    return {
      walletId:
        this.walletId === undefined ? this.crateWalletId() : this.walletId,
      assetId: this.assetId,
      walletType: this.walletType,
      clientId: this.clientId,
      balanceAvailable: this.getBalanceAvailable(),
      balance: this.balance,
      lockedBalance: this.lockedBalance,
      label: this.label,
    };
  }
}
