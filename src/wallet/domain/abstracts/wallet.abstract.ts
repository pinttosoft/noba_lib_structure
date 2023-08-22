import { Asset } from "@/asset/domain/asset";
import { IClient } from "@/client";
import { AggregateRoot } from "@/shared/domain/aggregate_root";
import { WalletType } from "@/wallet";

export abstract class Wallet extends AggregateRoot {
  protected walletId?: string;
  private assetId: string;
  protected walletType: WalletType;
  protected clientId: string;
  protected balance: number = 0;
  protected lockedBalance: number = 0;
  protected label: string;

  getWalletId(): string {
    return this.walletId;
  }

  setLabel(label: string): Wallet {
    this.label = label;
    return this;
  }

  setWalletType(type: WalletType): Wallet {
    this.walletType = type;
    return this;
  }

  protected getAssetId(): string {
    return this.assetId;
  }

  protected setAssetId(assetId: string): void {
    this.assetId = assetId;
  }

  setAsset(asset: Asset): Wallet {
    this.assetId = asset.getAssetId();
    return this;
  }

  setClient(client: IClient): Wallet {
    this.clientId = client.getClientId();
    this.createWalletId();
    return this;
  }

  private createWalletId(): string {
    return (this.clientId =
      this.clientId + "-" + this.assetId + "-" + this.label);
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  abstract getBalanceAvailable(): number;
}
