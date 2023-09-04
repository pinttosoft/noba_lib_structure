import { Asset } from "../../asset/domain/asset";
import { IClient } from "../../client";
import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { IWallet, WalletType } from "../../wallet";

export class Wallet extends AggregateRoot implements IWallet {
  private id?: string;
  private walletId: string;
  private assetId: string;
  private walletType: WalletType;
  private clientId: string;
  private balance: number;
  private lockedBalance: number;
  private label: string;

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

  setLabel(label: string): Wallet {
    this.label = label;
    return this;
  }

  setClient(client: IClient): Wallet {
    this.clientId = client.getClientId();
    return this;
  }

  build(): void {
    this.balance = 0;
    this.lockedBalance = 0;
    this.walletId = this.clientId + "-" + this.assetId + "-" + this.label;
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
      label: this.label,
    };
  }
}
