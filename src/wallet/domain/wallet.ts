import { Asset } from "../../asset/domain/asset";
import { WalletType } from "./enums/wallet_type";
import { IWallet } from "./interfaces/wallet.interface";

export abstract class Wallet {
  protected walletId?: string;
  protected assetId: string;
  protected walletType: WalletType;
  protected clientId: string;
  protected balance: number;
  protected lockedBalance: number;
  protected label: string;

  asset(asset: Asset): Wallet {
    this.assetId = asset.getAssetId();
    return this;
  }

  protected crateWalletId(): string {
    return (this.clientId =
      this.clientId + "-" + this.assetId + "-" + this.label);
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  setAssetId(assetId: string): IWallet {
    this.assetId = assetId;
    return this;
  }

  abstract getBalanceAvailable(): number;

  abstract toJson(): any;
}
