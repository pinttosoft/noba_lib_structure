import { Asset } from "@/asset/domain/asset";
import { WalletType } from "../enums/wallet_type";

export interface IWallet {
  getId(): string;
  getWalletId(): string;
  toPrimitives(): any;
  getBalanceAvailable(): number;
  getBalance(): number;
  getLockedBalance(): number;
  setAsset(asset: Asset): IWallet;
  getWalletType(): WalletType;
  calculateNewBalance(balance: number, lockedBalance: number): IWallet;
}
