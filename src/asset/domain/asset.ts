import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { AssetClassification } from "./enums/asset_classification.enum";
import { WalletProvider } from "../../wallet";

export class Asset extends AggregateRoot {
  private id?: string;
  private assetId: string;
  private assetClassification?: AssetClassification;
  private code: string;
  private icon: string;
  private name: string;
  private network: string;
  private networkName?: string;
  private coinId?: string;
  private providers: WalletProvider[];

  static createNewAsset(
    assetId: string,
    assetClassification: AssetClassification,
    code: string,
    icon: string,
    name: string,
    network: string,
    provider: WalletProvider[],
    networkName?: string,
    coinId?: string,
  ): Asset {
    const a: Asset = new Asset();

    a.assetId = assetId;
    a.assetClassification = assetClassification;
    a.code = code;
    a.icon = icon;
    a.name = name;
    a.network = network;
    a.networkName = networkName;
    a.coinId = coinId;
    a.providers = provider;

    return a;
  }

  static fromPrimitives(id: string, plainData: any): Asset {
    const a = Asset.createNewAsset(
      plainData.assetId,
      plainData.assetClassification,
      plainData.code,
      plainData.icon,
      plainData.name,
      plainData.network,
      plainData.provider ?? [WalletProvider.LAYER2],
      plainData.networkName,
      plainData.coinId,
    );

    a.id = id;
    return a;
  }

  getAssetClassification() {
    return this.assetClassification;
  }

  getId(): string {
    return this.id;
  }

  getAssetId() {
    return this.assetId;
  }

  getAssetCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }

  getProviders(): WalletProvider[] {
    return this.providers;
  }

  existsProvider(provider: WalletProvider): boolean {
    return this.providers.includes(provider);
  }

  getNetworkInformation() {
    return { name: this.networkName, network: this.network };
  }

  getIcon(): string {
    return this.icon;
  }

  getCoinId(): string {
    return this.coinId;
  }

  isCryptoAsset(): boolean {
    return this.assetClassification === AssetClassification.CRYPTO;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      assetId: this.assetId,
      assetClassification: this.assetClassification,
      code: this.code,
      icon: this.icon,
      name: this.name,
      network: this.network,
      networkName: this.networkName,
      coinId: this.coinId,
      providers: this.providers,
    };
  }
}
