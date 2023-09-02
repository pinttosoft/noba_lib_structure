import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IClient } from "../../domain/interfaces/client.interface";
import { AccountMongoRepository } from "../../../account/infrastructure/mongo/account_mongo_repository";
import { ClientRepository } from "../../domain/interfaces/client_repository.interface";
import { AccountNotFound } from "../../../account";
import { ClientFactory } from "../../domain/factories/client.factory";

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
