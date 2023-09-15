import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
  removeUndefined,
} from "../../../shared";
import { CounterpartyBankDTO } from "../../../banking/domain/types/counterparty_bank.type";
import {
  Counterparty,
  CounterpartyType,
  ICounterpartyRepository,
} from "../../index";
import { CounterpartyFactory } from "../../domain/factories/counterparty.factory";
import { CounterpartyBank } from "../../../banking";

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
    return "counterparty";
  }

  async findByClientId(
    clientId: string,
    counterpartyType: CounterpartyType,
  ): Promise<Paginate<Counterparty> | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({
      clientId,
      counterpartyType,
    });

    if (!result) {
      return undefined;
    }

    return Promise.resolve(undefined);
  }

  async findByCounterpartyId(
    counterpartyId: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne({
      counterpartyId,
    });

    if (!result) {
      return undefined;
    }

    return CounterpartyFactory.fromPrimitives(result._id.toString(), result);
  }

  async list(criteria: Criteria): Promise<Paginate<Counterparty> | undefined> {
    let document = await this.searchByCriteria<any>(criteria);
    document = document.map((d) => {
      return removeUndefined({ ...d, id: d._id.toString(), _id: undefined });
    });
    return Promise.resolve(undefined);
  }

  async upsert(counterparty: CounterpartyBank): Promise<void> {
    await this.persist(counterparty.getId(), counterparty);
  }

  async findByClientIdAndAddressPayment(
    clientId: string,
    addressPayment: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({
      clientId: clientId,
      "instructForDeposit.address": addressPayment,
    });

    if (!result) {
      return undefined;
    }

    return CounterpartyFactory.fromPrimitives(result._id.toString(), result);
  }
}
