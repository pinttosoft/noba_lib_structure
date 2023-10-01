import { IWallet } from "./wallet.interface";
import { Paginate } from "../../../shared";
import { InstructionDepositCrypto } from "../type/instruction_deposit_crypto.type";

export interface IWalletRepository {
  upsert(wallet: IWallet): Promise<IWallet>;

  updateBalance(wallet: IWallet): Promise<void>;

  findWalletsByClientId(clientId: string): Promise<IWallet[]>;

  findWalletsByClientIdAndAssetId(
    clientId: string,
    assetId: string,
  ): Promise<IWallet | undefined>;

  findPaymentAddressesByClientIdAndByAssetId(
    clientId: string,
    assetId: string,
    page: number,
    rowPerPage: number,
  ): Promise<Paginate<InstructionDepositCrypto>>;

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
}
