import {
  Account,
  AccountFactory,
  IAccount,
  IAccountRepository,
} from "../../index";
import { MongoClientFactory, MongoRepository } from "../../../shared";

export class AccountMongoRepository
  extends MongoRepository<Account>
  implements IAccountRepository
{
  private static _instance: AccountMongoRepository;

  public static instance(): AccountMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AccountMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "accounts";
  }

  async findByAccountId(accountId: string): Promise<IAccount | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ accountId });
    if (!result) {
      return undefined;
    }

    return AccountFactory.fromPrimitives(result._id.toString(), { ...result });
  }

  async upsert(account: Account): Promise<void> {
    await this.persist(account.getId(), account);
  }

  async findAccountByOwnerEmail(email: string): Promise<IAccount | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ "owner.email": email });

    if (!result) {
      return undefined;
    }

    return AccountFactory.fromPrimitives(result._id.toString(), { ...result });
  }
}
