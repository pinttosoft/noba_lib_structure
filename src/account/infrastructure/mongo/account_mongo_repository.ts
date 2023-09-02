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
}
