import { IWallet, WalletRepository } from "@/wallet";
import { MongoRepository } from "@/shared/infrastructure/mongodb/MongoRepository";
import { MongoClientFactory } from "@/shared/infrastructure/mongodb/MongoClientFactory";

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
      .find({
        clientId,
      })
      .toArray();

    const wallets: IWallet[] = [];

    for (const wallet of result) {
      wallet.wallets.push();
    }
    return Promise.resolve([]);
  }

  updateBalance(
    available: number,
    lockedBalance: number,
    walletId: string,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  async upsert(wallet: IWallet): Promise<void> {
    await this.persist(wallet.getWalletId(), wallet);
  }
}
