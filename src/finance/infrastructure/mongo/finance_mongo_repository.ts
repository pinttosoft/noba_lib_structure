import { Finance, FinancialMovement, IFinanceRepository } from "../../index";
import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
} from "../../../shared";

export class FinanceMongoRepository
  extends MongoRepository<Finance>
  implements IFinanceRepository
{
  private static _instance: FinanceMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

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
    const result = await collection.findOne<any>({ referenceId });
    if (!result) {
      return undefined;
    }

    const payload = { ...result, id: result._id };

    return new Finance(payload as unknown as FinancialMovement);
  }

  async upsert(fee: Finance): Promise<void> {
    await this.persist(fee.getId(), fee);
  }

  async list(
    criteria: Criteria,
    pipelines?: any[],
  ): Promise<Paginate<Finance>> {
    const document: Finance[] = await this.searchByCriteria<Finance>(criteria);

    if (pipelines) {
      console.log("aqqqq");
      return this.paginateAggregation(criteria);
    }

    return this.buildPaginate<Finance>(document);
  }

  async getAllieSwapConsolidate(clientId: string) {
    const collection = await this.collection();

    let filter: any = {
      clientId,
      typeFinancialMovement: "OUTGOING_PAYMENT_BUSINESS_ALLIE",
    };

    const pipeline = [
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$exchange.destinationDetails.assetCode",
          total: {
            $sum: "$amount",
          },
        },
      },
    ];

    return await collection.aggregate(pipeline).toArray();
  }
}
