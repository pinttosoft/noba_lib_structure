import { MongoRepository } from "@/shared/infrastructure/mongodb/MongoRepository";
import { MongoClientFactory } from "@/shared/infrastructure/mongodb/MongoClientFactory";
import {
  Account,
  AccountFactory,
  IAccount,
  IAccountRepository,
} from "@/account";

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

    return AccountFactory.fromJson(result._id.toString(), { ...result });
  }
}
