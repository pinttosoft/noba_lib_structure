import {MongoClientFactory, MongoRepository, Paginate} from "../../shared";
import {ISwapRepository} from "../domain/interfaces/swap.repository";
import {ExchangeType} from "../domain/types/exchange.type";
import {FeeSwapDTO} from "../../system_configuration";

export class SwapMongoRepository extends MongoRepository<any> implements ISwapRepository{
  private static _instance: SwapMongoRepository;

  public static instance(): SwapMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SwapMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "exchanges";
  }

  getExchangeById(id: string): Promise<ExchangeType | undefined> {
    return Promise.resolve(undefined);
  }

  getExchangesByClientId(clientId: string, initDoc?: string): Promise<Paginate<ExchangeType> | undefined> {
    return Promise.resolve(undefined);
  }

  getFeeSwapByClientId(clientId: string): Promise<FeeSwapDTO | undefined> {
    return Promise.resolve(undefined);
  }

  async saveExchange(exchange: ExchangeType): Promise<void> {
    // const collection = await this.collection();
    //
    // await collection.updateOne(
    //   {exchangeId: exchange.exchangeId},{...exchange},
    //   {
    //     upsert: true,
    //   },
    // );
  }

  updateExchange(exchange: ExchangeType): Promise<void> {
    return Promise.resolve(undefined);
  }
//
}