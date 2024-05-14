import {
  Criteria,
  Filters,
  MongoClientFactory,
  MongoRepository,
  Operator,
  Order,
  OrderTypes,
  Paginate,
} from "../../shared";
import { IExchangeRepository } from "../domain/interfaces/exchange_repository.interface";
import { Exchange } from "../domain/exchange";

export class ExchangeMongoRepository
  extends MongoRepository<Exchange>
  implements IExchangeRepository
{
  private static _instance: ExchangeMongoRepository;

  public static instance(): ExchangeMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ExchangeMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "exchanges";
  }

  async getExchangeById(exchangeId: string): Promise<Exchange | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ exchangeId });
    if (!result) {
      return undefined;
    }
    return Exchange.fromPrimitives(result._id.toString(), result);
  }

  async getExchangesByClientId(
    clientId: string,
    page: number,
    perPage: number,
  ): Promise<Paginate<Exchange> | undefined> {
    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const criteria: Criteria = new Criteria(
      Filters.fromValues([filterClientId]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      perPage,
      page,
    );

    const document: Exchange[] =
      await this.searchByCriteria<Exchange>(criteria);

    return this.buildPaginate<Exchange>(document);
  }

  async upsert(exchange: Exchange): Promise<void> {
    await this.persist(exchange.getId(), exchange);
  }
}
