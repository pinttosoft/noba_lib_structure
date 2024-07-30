import { IWallet } from "./wallet.interface";
import { Paginate } from "../../../shared";
import { InstructionDepositCrypto } from "../type/instruction_deposit_crypto.type";
import { WalletType } from "../enums/wallet_type.enum";

export interface IWalletRepository {
  insert(wallet: IWallet): Promise<IWallet>;

  update(wallet: IWallet): Promise<void>;

  updateBalance(wallet: IWallet): Promise<void>;

  findWalletsByClientId(
    clientId: string,
    cryptoWalletType?: WalletType,
  ): Promise<IWallet[]>;

  findWalletsByClientIdAndAssetId(
    clientId: string,
    assetId: string,
    walletType?: WalletType,
  ): Promise<IWallet | undefined>;

  findWalletsByClientIdAndAssetCode(
    clientId: string,
    assetCode: string,
    cryptoWalletType?: WalletType,
  ): Promise<IWallet | undefined>;

  findPaymentAddressesByClientIdAndByAssetId(
    clientId: string,
    assetId?: string,
  ): Promise<InstructionDepositCrypto[]>;

  findPaymentAddressByClientId(
    clientId: string,
    page: number,
    rowPerPage: number,
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
