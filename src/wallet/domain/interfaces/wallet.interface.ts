import { WalletType } from "../enums/wallet_type.enum";
import { InstructionDepositCrypto } from "../type/instruction_deposit_crypto.type";
import { InstructionDepositFiat } from "../../../banking";
import { IClient } from "../../../client";
import { Asset } from "../../../asset";

export interface IWallet {
  getId(): string;
  getClient(): IClient;
  getClientId(): string;
  getWalletId(): string;
  toPrimitives(): any;
  getBalanceAvailable(): number;
  getBalance(): number;
  getLockedBalance(): number;
  getCreditBalance(): number;
  getAsset(): Asset;
  getWalletType(): WalletType;
  getAccountId(): string;
  getIdentifierForInstructionOfDeposit(label: string): string;
  getInstructionForDeposit(): InstructionDepositCrypto | InstructionDepositFiat;
  setNewBalance(balance: number, lockedBalance: number, creditBalance:number): IWallet;
  setCreditBalance(creditBalance: number): IWallet
  calculateNewBalance(balance: number, lockedBalance: number): IWallet;
  updateLookBalance(amount: number): IWallet;
  updateBalance(amount: number): IWallet;
  setInstructionForDeposit(
    data: InstructionDepositCrypto | InstructionDepositFiat,
  ): IWallet;
}
