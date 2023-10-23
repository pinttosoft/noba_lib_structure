import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
} from "../../../shared";
import {
  Counterparty,
  CounterpartyType,
  ICounterpartyRepository,
} from "../../index";
import { CounterpartyBank } from "../../../banking";
import {
  Asset,
  AssetMongoRepository,
  AssetNotFound,
  CounterpartyAsset,
} from "../../../asset";

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

  async delete(counterpartyId: string): Promise<void> {
       const collection = await this.collection();
       await collection.deleteMany({counterpartyId});
  }

  collectionName(): string {
    return "counterparty";
  }

  async findByClientIdAndCounterpartyType(
    clientId: string,
    counterpartyType: CounterpartyType,
  ): Promise<Paginate<Counterparty> | undefined> {
    const collection = await this.collection();
    const result = await collection
      .find({
        clientId,
        counterpartyType,
      })
      .toArray();

    if (!result) {
      return undefined;
    }

    result.map((r) => {
      if (r.counterpartyType === CounterpartyType.CRYPTO) {
        CounterpartyAsset.fromPrimitives(r._id.toString(), r);
      } else {
        CounterpartyBank.fromPrimitives(r._id.toString(), r);
      }
    });

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

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyBank.fromPrimitives(result._id.toString(), result);
  }

  async findByCounterpartyIdAndAssetId(
    counterpartyId: string,
    assetId: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne({
      counterpartyId,
      assetId,
    });

    if (!result) {
      return undefined;
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyBank.fromPrimitives(result._id.toString(), result);
  }

  async list(criteria: Criteria): Promise<Paginate<Counterparty> | undefined> {
    let document: any[] = await this.searchByCriteria<any>(criteria);

    document = document.map((d): Counterparty => {
      if (d.counterpartyType === CounterpartyType.CRYPTO) {
        return CounterpartyAsset.fromPrimitives(d._id.toString(), d);
      }
      return CounterpartyBank.fromPrimitives(d._id.toString(), d);
    });

    return this.buildPaginate<Counterparty>(document);
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
      "informationWallet.address": addressPayment,
    });

    if (!result) {
      return undefined;
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyBank.fromPrimitives(result._id.toString(), result);
  }
}
