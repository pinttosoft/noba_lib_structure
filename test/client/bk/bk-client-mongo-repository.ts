import {
  AccountMongoRepository,
  AccountNotFound,
  AccountStatus,
  ClientFactory,
  Criteria,
  IAccount,
  IClient,
  MongoClientFactory,
  MongoRepository,
  Paginate,
} from "../../../src";
import { AccountType } from "aws-sdk/clients/chime";

export type BasicCustomerData = {
  clientId: string;
  accountId: string;
  name?: string;
  middleName: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  status: string;
  isSegregated: boolean;
  type: AccountType;
};

export interface IBKClientRepository {
  fetchCriteria(payload: Criteria): Promise<Paginate<IClient>>;

  findByClientId(clientId: string): Promise<IClient | undefined>;

  findByActive(): Promise<BasicCustomerData[]>;

  upsert(client: IClient): Promise<void>;

  searchApprovedClientsWithoutIncludingAccountData(): Promise<
    BasicCustomerData[]
  >;
}

export class BkClientMongoRepository
  extends MongoRepository<IClient>
  implements IBKClientRepository
{
  private static _instance: BkClientMongoRepository;

  public static instance(): BkClientMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BkClientMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "clients";
  }

  async fetchCriteria(criteria: Criteria): Promise<Paginate<IClient>> {
    const clients: IClient[] = await this.searchByCriteria<any>(criteria);

    const accountRepository = new AccountMongoRepository();

    const clientObjs = await Promise.all(
      clients.map(async (client: any) => {
        const account = await accountRepository.findByAccountId(
          client.accountId,
        );
        return ClientFactory.fromPrimitives(
          client._id.toString(),
          client,
          account,
        );
      }),
    );

    return this.buildPaginate<IClient>(clientObjs);
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

  // todo, should we use those from the lib or should we create our owns?
  private async buildClient(client: any, resultId: string): Promise<IClient> {
    const account: IAccount =
      await new AccountMongoRepository().findByAccountId(client.accountId);

    if (!account) {
      throw new AccountNotFound(client.accountId);
    }

    return ClientFactory.fromPrimitives(resultId, client, account);
  }

  /**
   * Retonar los clientes activos sin incluir el registro de cuenta
   */
  public async searchApprovedClientsWithoutIncludingAccountData(): Promise<
    BasicCustomerData[]
  > {
    const collection = await this.collection();
    const result = await collection
      .find({ status: AccountStatus.APPROVED })
      .toArray();

    return result.map((client) => {
      return { ...client } as unknown as BasicCustomerData;
    });
  }

  async findByActive(): Promise<BasicCustomerData[]> {
    const collection = await this.collection();
    const filters: any = { status: AccountStatus.APPROVED };

    const result = await collection.find(filters).toArray();

    return result.map((client) => {
      return { ...client } as unknown as BasicCustomerData;
    });
  }
}
