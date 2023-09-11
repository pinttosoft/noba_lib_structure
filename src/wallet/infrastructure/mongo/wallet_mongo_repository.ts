import { IWallet, WalletFactory, WalletRepository } from "../../../wallet";
import { MongoClientFactory, MongoRepository } from "../../../shared";
import { ClientMongoRepository } from "../../../client/infrastructure/mongo/client_mongo_repository";
import { ObjectId } from "mongodb";

interface WalletDocument {
  _id: ObjectId;
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
  private static _instance: WalletMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

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
      const client = await ClientMongoRepository.instance().findByClientId(
        wallet.clientId,
      );

      wallets.push(
        WalletFactory.fromPrimitives(
          wallet._id.toString(),
          { ...wallet },
          client,
        ),
      );
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
    await this.persist(wallet.getId(), wallet);
  }
}
