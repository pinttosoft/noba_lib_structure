import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IPanamaBankingRepository } from "../../domain/interfaces/panama_banking_repository.interface";
import { PanamaBankingRails } from "../../domain/panama_banking_rails";

export class PanamaMongoRepository
  extends MongoRepository<PanamaBankingRails>
  implements IPanamaBankingRepository
{
  private static _instance: PanamaMongoRepository;

  public static instance(): PanamaMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new PanamaMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "panama_banks";
  }

  async fetchPanamaBanks(): Promise<PanamaBankingRails[] | undefined> {
    const collection = await this.collection();
    const result = await collection.find();

    if (!result) {
      return undefined;
    }

    console.log(result);
  }
}
