import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IBankingRepository } from "../../domain/interfaces/banking_repository.interface";
import { BankingRails } from "../../domain/banking_rails";
import { ObjectId } from "mongodb";

export class BankingMongoRepository
  extends MongoRepository<any>
  implements IBankingRepository
{
  private static _instance: BankingMongoRepository;

  public static instance(): BankingMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BankingMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "supported_rails";
  }

  async findBankingRailByCountryCode(
    countryCode: string,
  ): Promise<BankingRails | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ countryCode });
    if (!result) {
      return undefined;
    }

    return new BankingRails().fromPrimitives({ id: result._id, ...result });
  }

  async upsert(bankingRails: BankingRails): Promise<void> {
    await this.persist(bankingRails.getId(), bankingRails);
  }

  async fetchAll(): Promise<BankingRails[] | undefined> {
    const collection = await this.collection();
    const result = await collection.find().toArray();

    if (!result) {
      return undefined;
    }

    return result.map((rail) =>
      new BankingRails().fromPrimitives({ id: rail._id, ...rail }),
    );
  }

  async deleteRail(bankingRail: BankingRails): Promise<void> {
    const collection = await this.collection();

    await collection.deleteOne({
      countryCode: bankingRail.getCountryCode(),
      countryName: bankingRail.getCountryName(),
    });
  }

  async editRail(bankingRail: BankingRails): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      {
        id: new ObjectId(bankingRail.getId()),
      },
      {
        $set: bankingRail,
      },
    );
  }
}
