import { IWallet } from "./wallet.interface";

export interface WalletRepository {
  upsert(wallet: IWallet): Promise<void>;
  updateBalance(wallet: IWallet): Promise<void>;

  findWalletsByClientId(clientId: string): Promise<IWallet[]>;
}
