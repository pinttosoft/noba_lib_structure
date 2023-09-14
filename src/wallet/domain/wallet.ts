import { IClient } from "../../client";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { IWallet, WalletType } from "../../wallet";
import { InstructionDepositCrypto } from "./type/instruction_deposit_crypto.type";
import { v4 } from "uuid";
import { InstructionDepositFiat } from "../../banking";
import { Asset } from "../../asset";

export class Wallet extends AggregateRoot implements IWallet {
  private id?: string;
  private walletId: string;
  private asset: Asset;
  private walletType: WalletType;
  private clientId: string;
  private balance: number;
  private lockedBalance: number;
  private label: string;
  private client: IClient;
  private instructForDeposit:
    | InstructionDepositFiat[]
    | InstructionDepositCrypto[];

  private recentInstruction: InstructionDepositFiat | InstructionDepositCrypto;

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

  setAsset(asset: Asset): Wallet {
    this.asset = asset;
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
    this.recentInstruction = d;

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

  getRecentInstruction(): InstructionDepositFiat | InstructionDepositCrypto {
    return this.recentInstruction;
  }

  build(): void {
    this.balance = 0;
    this.lockedBalance = 0;
    this.walletId = v4();
  }

  getClientId(): string {
    return this.clientId;
  }

  getClient(): IClient {
    return this.client;
  }

  /**
   * Genera un identificador para solicitar instrucciones de deposito
   * @param label
   */
  getIdentifierForInstructionOfDeposit(label: string): string {
    return this.clientId + "-" + this.asset.getAssetId() + "-" + this.label;
  }

  getInstructionForDeposit():
    | InstructionDepositCrypto[]
    | InstructionDepositFiat[] {
    return this.instructForDeposit;
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

  getAsset(): Asset {
    return this.asset;
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
      id: this.id,
      walletId: this.walletId,
      assetId: this.getAsset().getAssetId(),
      walletType: this.walletType,
      clientId: this.clientId,
      balance: this.balance,
      lockedBalance: this.lockedBalance,
      instructionForDeposit: this.instructForDeposit,
    };
  }
}
