import { Asset } from "../../../asset/domain/asset";
import { WalletType } from "../enums/wallet_type";

export interface IWallet {
  getId(): string;
  getWalletId(): string;
  toPrimitives(): any;
  getBalanceAvailable(): number;
  getBalance(): number;
  getLockedBalance(): number;
  getAssetId(): string;
  getWalletType(): WalletType;
  getAccountId(): string;
  calculateNewBalance(balance: number, lockedBalance: number): IWallet;
}
