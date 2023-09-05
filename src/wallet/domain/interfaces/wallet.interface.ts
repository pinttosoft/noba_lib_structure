import { Asset } from "../../../asset/domain/asset";
import { WalletType } from "../enums/wallet_type";
import { InstructionDepositCrypto } from "../type/instruction_deposit_crypto.type";
import { InstructionDepositFiat } from "../../../banking/domain/types/instruction_deposit_fiat.type";

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
  getIdentifierForInstructionOfDeposit(label: string): string;
  getInstructionForDeposit():
    | InstructionDepositCrypto[]
    | InstructionDepositFiat;
  addNewInstructionForDeposit(
    data: InstructionDepositCrypto | InstructionDepositFiat,
  ): IWallet;
  calculateNewBalance(balance: number, lockedBalance: number): IWallet;
}
