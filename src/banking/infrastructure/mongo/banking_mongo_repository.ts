import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IBankingRepository } from "../../domain/interfaces/banking_repository.interface";

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
    return "";
  }

  saveExternalTransfer(
    originClient: string,
    amount: number,
    beneficiaryId: string,
    reference: string,
    feeWire?: number,
  ): Promise<string> {
    return Promise.resolve("");
  }

  saveInternalTransfer(
    amount: number,
    clientDestination: string,
    originClient: string,
    reference: string,
  ): Promise<string> {
    return Promise.resolve("");
  }
}
