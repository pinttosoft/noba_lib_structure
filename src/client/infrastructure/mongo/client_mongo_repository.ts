import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IClient } from "../../domain/interfaces/client.interface";
import { IClientRepository } from "../../domain/interfaces/client_repository.interface";
import {
  AccountMongoRepository,
  AccountNotFound,
  IAccount,
} from "../../../account";
import { ClientFactory } from "../../domain/factories/client.factory";

export class ClientMongoRepository
  extends MongoRepository<IClient>
  implements IClientRepository
{
  private static _instance: ClientMongoRepository;

  public static instance(): ClientMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ClientMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "clients";
  }

  async findByEmail(email: string): Promise<IClient> {
    const collection = await this.collection();

    const result = await collection.findOne({ email });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  private async buildClient(client: any, resultId: string): Promise<IClient> {
    const account: IAccount =
      await new AccountMongoRepository().findByAccountId(client.accountId);

    if (!account) {
      throw new AccountNotFound(client.accountId);
    }

    return ClientFactory.fromPrimitives(resultId, client, account);
  }

  async findByClientId(clientId: string): Promise<IClient | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne({ clientId });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async upsert(client: IClient): Promise<void> {
    await this.persist(client.getId(), client);
  }

  async findByIDNumber(idNumber: string): Promise<IClient> {
    const collection = await this.collection();
    const result = await collection.findOne({ idNumber });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findAll(): Promise<string[]> {
    const collection = await this.collection();
    const result = await collection.find().toArray();
    if (!result) {
      return undefined;
    }

    const ids: string[] = [];
    result.map(async (client) => {
      ids.push(client.clientId);
    });

    return ids;
  }
}
