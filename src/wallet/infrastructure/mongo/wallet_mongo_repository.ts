import {
  IWallet,
  WalletFactory,
  IWalletRepository,
  InstructionDepositCrypto,
} from "../../../wallet";
import { MongoClientFactory, MongoRepository } from "../../../shared";
import { ObjectId } from "mongodb";
import { ClientMongoRepository, IClient } from "../../../client";
import { InstructionDepositFiat } from "../../../banking";

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
  implements IWalletRepository
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
      { walletId: wallet.getWalletId(), assetId: wallet.getAssetId() },
      {
        $set: {
          balance: wallet.getBalance(),
          lockedBalance: wallet.getLockedBalance(),
        },
      },
    );
    return Promise.resolve(undefined);
  }

  async upsert(wallet: IWallet): Promise<IWallet> {
    const id: ObjectId = await this.persist(wallet.getId(), wallet);

    return WalletFactory.fromPrimitives(
      id.toString(),
      wallet.toPrimitives(),
      wallet.getClient(),
    );
  }

  async findWalletsByClientIdAndAssetId(
    clientId: string,
    assetId: string,
  ): Promise<IWallet | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne<WalletDocument>({
      clientId,
      assetId,
    });

    if (!result) {
      return undefined;
    }

    const client: IClient =
      await ClientMongoRepository.instance().findByClientId(clientId);

    return WalletFactory.fromPrimitives(result._id.toString(), result, client);
  }

  async addNewInstructionForDeposit(wallet: IWallet): Promise<void> {
    const collection = await this.collection();

    const instructions: InstructionDepositCrypto[] | InstructionDepositFiat[] =
      wallet.getInstructionForDeposit();

    const updateDocument = {
      $push: {
        instructForDeposit: instructions[instructions.length - 1],
      },
    };

    await collection.updateOne(
      { clientId: wallet.getClientId(), assetId: wallet.getAssetId() },
      updateDocument,
      {
        upsert: true,
      },
    );
  }
}
