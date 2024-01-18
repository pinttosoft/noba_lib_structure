import { CounterpartyAchPabRepositoryInterface } from "../../domain/interfaces/counterparty_achpab_repository.interface";
import { CounterpartyAchPab } from "../../../banking";
import { MongoClientFactory, MongoRepository } from "../../../shared";

export class CounterpartyAchPabMongoRepository
  extends MongoRepository<CounterpartyAchPab>
  implements CounterpartyAchPabRepositoryInterface
{
  private static _instance: CounterpartyAchPabMongoRepository;

  public static instance(): CounterpartyAchPabMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new CounterpartyAchPabMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "counterparty";
  }

  async findMyCounterpartyByAssetId(
    clientId: string,
    counterpartyId: string,
    assetId: string,
  ): Promise<CounterpartyAchPab | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({
      clientId: clientId,
      counterpartyId,
      assetId,
    });

    if (!result) {
      return undefined;
    }

    return CounterpartyAchPab.fromPrimitives(result._id.toString(), result);
  }

  async upsert(counterparty: CounterpartyAchPab): Promise<void> {
    return Promise.resolve(undefined);
  }
}
