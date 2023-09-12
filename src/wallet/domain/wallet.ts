import { IClient } from "../../client";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { IWallet, WalletType } from "../../wallet";
import { InstructionDepositCrypto } from "./type/instruction_deposit_crypto.type";
import { v4 } from "uuid";
import { InstructionDepositFiat } from "../../banking";

export class Wallet extends AggregateRoot implements IWallet {
  private id?: string;
  private walletId: string;
  private assetId: string;
  private walletType: WalletType;
  private clientId: string;
  private balance: number;
  private lockedBalance: number;
  private label: string;
  private client: IClient;
  private instructForDeposit:
    | InstructionDepositFiat[]
    | InstructionDepositCrypto[];

  setId(id: string): Wallet {
    this.id = id;
    return this;
  }

  setWalletType(type: WalletType): Wallet {
    this.walletType = type;
    return this;
  }

  setClientId(clientId: string): Wallet {
    this.clientId = clientId;
    return this;
  }

  setWalletId(walletId: string): Wallet {
    this.walletId = walletId;
    return this;
  }

  setBalance(balance: number): Wallet {
    this.balance = balance;
    return this;
  }

  setLockedBalance(lockedBalance: number) {
    this.lockedBalance = lockedBalance;
  }

  setAssetId(assetId: string): Wallet {
    this.assetId = assetId;
    return this;
  }

  setClient(client: IClient): Wallet {
    this.client = client;
    this.clientId = client.getClientId();
    return this;
  }

  setInstructionForDeposit(
    data: InstructionDepositCrypto[] | InstructionDepositFiat[],
  ): Wallet {
    this.instructForDeposit = data;
    return this;
  }

  addNewInstructionForDeposit(
    data: InstructionDepositCrypto | InstructionDepositFiat,
  ): Wallet {
    const d: any = data;
    if (
      this.instructForDeposit === undefined ||
      this.instructForDeposit.length === 0
    ) {
      this.instructForDeposit = [d];
      return this;
    }

    this.instructForDeposit.push(d);
    return this;
  }

  build(): void {
    this.balance = 0;
    this.lockedBalance = 0;
    this.walletId = v4();
  }

  /**
   * Genera un identificador para solicitar instrucciones de deposito
   * @param label
   */
  getIdentifierForInstructionOfDeposit(label: string): string {
    return this.clientId + "-" + this.assetId + "-" + this.label;
  }

  getInstructionForDeposit():
    | InstructionDepositCrypto[]
    | InstructionDepositFiat {
    if (this.walletType === WalletType.FIAT) {
      return this.instructForDeposit[0] as InstructionDepositFiat;
    }

    return this.instructForDeposit as InstructionDepositCrypto[];
  }

  getAccountId(): string {
    return this.client.getAccount().getAccountId();
  }
  getWalletId(): string {
    return this.walletId;
  }

  getBalance(): number {
    return this.balance;
  }

  getLockedBalance(): number {
    return this.lockedBalance;
  }

  calculateNewBalance(balance: number, lockedBalance: number): Wallet {
    this.balance = balance;
    this.lockedBalance = lockedBalance;
    return this;
  }

  getAssetId(): string {
    return this.assetId;
  }

  getId(): string {
    return this.id;
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  getBalanceAvailable(): number {
    return this.walletType === WalletType.FIAT
      ? Number((this.balance - this.lockedBalance).toPrecision(2))
      : Number((this.balance - this.lockedBalance).toPrecision(6));
  }

  toPrimitives(): any {
    return {
      walletId: this.walletId,
      assetId: this.getAssetId(),
      walletType: this.walletType,
      clientId: this.clientId,
      balance: this.balance,
      lockedBalance: this.lockedBalance,
      instructionForDeposit: this.instructForDeposit,
    };
  }
}
