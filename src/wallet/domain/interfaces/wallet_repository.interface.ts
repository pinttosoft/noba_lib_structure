import { IWallet } from "./wallet.interface";
import { Paginate } from "../../../shared";
import { InstructionDepositCrypto } from "../type/instruction_deposit_crypto.type";
import { WalletProvider } from "../enums/wallet_provider.enum";

export interface IWalletRepository {
  insert(wallet: IWallet): Promise<IWallet>;

  update(wallet: IWallet): Promise<void>;

  updateBalance(wallet: IWallet): Promise<void>;

  findWalletsByClientId(
    clientId: string,
    walletProvider: WalletProvider[],
  ): Promise<IWallet[]>;

  findWalletsByClientIdAndAssetId(
    clientId: string,
    assetId: string,
    walletProvider: WalletProvider,
  ): Promise<IWallet | undefined>;

  findPaymentAddressesByClientIdAndByAssetId(
    clientId: string,
    walletProvider: WalletProvider,
    assetId?: string,
  ): Promise<InstructionDepositCrypto[]>;

  findPaymentAddressByClientId(
    clientId: string,
    page: number,
    rowPerPage: number,
    walletProvider: WalletProvider,
  ): Promise<Paginate<InstructionDepositCrypto>>;

  findWalletByClientIdAndWalletId(
    clientId: string,
    walletId: string,
  ): Promise<IWallet | undefined>;

  findByWalletId(walletId: string): Promise<IWallet | undefined>;

  findByInstructionForDepositId(
    instructionDepositId: string,
  ): Promise<IWallet | undefined>;

  deleteByWalletId(walletId: string): Promise<void>;
}
