import { Asset } from "../../../asset/domain/asset";
import { Wallet } from "../wallet";
import { WalletType } from "../enums/wallet_type";

export interface IWallet {
  toJson(): any;
  getBalanceAvailable(): number;
  asset(asset: Asset): IWallet;
  setAssetId(assetId: string): IWallet;
  getWalletType(): WalletType;
  getBalanceAvailable(): number;
}
