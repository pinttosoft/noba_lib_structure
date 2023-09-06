import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
  removeUndefined,
} from "../../../shared";
import { Counterparty } from "../../domain/counterparty";
import { ICounterpartyRepository } from "../../domain/interfaces/counterparty_repository.interface";
import { CounterpartyDTO } from "../../domain/types/counterparty.type";

export class CounterpartyMongoRepository
  extends MongoRepository<Counterparty>
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

  async findByClientId(clientId: string): Promise<Counterparty | undefined> {
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

  async upsert(counterparty: Counterparty): Promise<void> {
    await this.persist(counterparty.getId(), counterparty);
  }
}
