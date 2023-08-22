import { IWallet, WalletFactory, WalletRepository } from "@/wallet";
import { MongoRepository } from "@/shared/infrastructure/mongodb/MongoRepository";
import { MongoClientFactory } from "@/shared/infrastructure/mongodb/MongoClientFactory";

interface WalletDocument {
  _id: string;
  walletId: string;
  assetId: string;
  walletType: string;
  clientId: string;
  balance: number;
  lockedBalance: number;
  label: string;
}

export class WalletMongoRepository
  extends MongoRepository<IWallet>
  implements WalletRepository
{
  constructor() {
    super(MongoClientFactory.createClient());
  }

  private static _instance: WalletMongoRepository;

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new WalletMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "wallets";
  }

  async findWalletsByClientId(clientId: string): Promise<IWallet[]> {
    const collection = await this.collection();

    const result = await collection
      .find<WalletDocument>({
        clientId,
      })
      .toArray();

    const wallets: IWallet[] = [];

    for (const wallet of result) {
      wallets.push(WalletFactory.fromJson({ ...wallet }));
    }

    return wallets;
  }

  async updateBalance(wallet: IWallet): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      { walletId: wallet.getWalletId() },
      {
        $set: {
          balance: wallet.getBalance(),
          lockedBalance: wallet.getLockedBalance(),
        },
      },
    );
    return Promise.resolve(undefined);
  }

  async upsert(wallet: IWallet): Promise<void> {
    await this.persist(wallet.getWalletId(), wallet);
  }
}
