import { IWallet } from "@/wallet";

export interface WalletRepository {
  upsert(wallet: IWallet): Promise<void>;
  updateBalance(
    available: number,
    lockedBalance: number,
    walletId: string,
  ): Promise<void>;

  findWalletsByClientId(clientId: string): Promise<IWallet[]>;
}
