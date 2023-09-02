import { FinancialMovement, IFinanceRepository, Finance } from "../../index";
import { MongoClientFactory, MongoRepository } from "../../../shared";

export class FinanceMongoRepository
  extends MongoRepository<Finance>
  implements IFinanceRepository
{
  constructor() {
    super(MongoClientFactory.createClient());
  }

  private static _instance: FinanceMongoRepository;

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new FinanceMongoRepository();
    return this._instance;
  }
  collectionName(): string {
    return "finance";
  }

  async getByReferenceId(referenceId: string): Promise<Finance | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ referenceId });
    if (!result) {
      return undefined;
    }

    const payload = { ...result, id: result._id };

    return new Finance(payload as unknown as FinancialMovement);
  }

  async upsert(fee: Finance): Promise<void> {
    await this.persist(fee.getId(), fee);
  }
}
