import { Asset } from "@/asset/domain/asset";
import { WalletType } from "../enums/wallet_type";

export interface IWallet {
  getWalletId(): string;
  toPrimitives(): any;
  getBalanceAvailable(): number;
  setAsset(asset: Asset): IWallet;
  getWalletType(): WalletType;
}
