import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
  removeUndefined,
} from "../../../shared";
import { CounterpartyBank } from "../../domain/counterpartyBank";
import { ICounterpartyRepository } from "../../../counterparty/domain/interfaces/counterparty_repository.interface";
import { CounterpartyDTO } from "../../domain/types/counterparty.type";

export class CounterpartyMongoRepository
  extends MongoRepository<CounterpartyBank>
  implements ICounterpartyRepository
{
  private static _instance: CounterpartyMongoRepository;

  public static instance(): CounterpartyMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new CounterpartyMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "counterparty_bank";
  }

  async findByClientId(
    clientId: string,
  ): Promise<CounterpartyBank | undefined> {
    return Promise.resolve(undefined);
  }

  async list(
    criteria: Criteria,
  ): Promise<Paginate<CounterpartyDTO> | undefined> {
    let document = await this.searchByCriteria<any>(criteria);
    document = document.map((d) => {
      return removeUndefined({ ...d, id: d._id.toString(), _id: undefined });
    });
    return Promise.resolve(undefined);
  }

  async upsert(counterparty: CounterpartyBank): Promise<void> {
    await this.persist(counterparty.getId(), counterparty);
  }
}
