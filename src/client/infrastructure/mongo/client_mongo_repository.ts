import { ClientRepository } from "@/client/domain/interfaces/client_repository.interface";
import { MongoRepository } from "@/shared/infrastructure/mongodb/MongoRepository";
import { IClient } from "@/client";
import { MongoClientFactory } from "@/shared/infrastructure/mongodb/MongoClientFactory";
import { ClientFactory } from "@/client/domain/factories/client.factory";
import { AccountMongoRepository } from "@/account/infrastructure/mongo/account_mongo_repository";
import { AccountNotFound } from "@/account";

export class ClientMongoRepository
  extends MongoRepository<IClient>
  implements ClientRepository
{
  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "clients";
  }

  async findByClientId(clientId: string): Promise<IClient | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne({ clientId });
    if (!result) {
      return undefined;
    }

    const client: any = { ...result };

    const account = await new AccountMongoRepository().findByAccountId(
      client.accountId,
    );

    if (!account) {
      throw new AccountNotFound(client.accountId);
    }

    return ClientFactory.fromPrimitives(result._id.toString(), client, account);
  }

  async upsert(client: IClient): Promise<void> {
    await this.persist(client.getId(), client);
  }
}
