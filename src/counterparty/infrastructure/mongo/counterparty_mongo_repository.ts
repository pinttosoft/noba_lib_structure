import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
} from "../../../shared";
import {
  Counterparty,
  CounterpartyStatus,
  CounterpartyType,
  ICounterpartyRepository,
} from "../../index";
import { CounterpartyAchPab, CounterpartyBank } from "../../../banking";
import { CounterpartyAsset } from "../../../asset";

export class CounterpartyMongoRepository
  extends MongoRepository<Counterparty>
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
    await collection.deleteMany({ counterpartyId });
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
      .find<any>({
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

    const result = await collection.findOne<any>({
      counterpartyId,
    });

    if (!result) {
      return undefined;
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    if (result.informationBank.networkBank) {
      return CounterpartyBank.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyAchPab.fromPrimitives(result._id.toString(), result);
  }

  async findByCounterpartyIdAndAssetId(
    counterpartyId: string,
    assetId: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne<any>({
      counterpartyId,
      assetId,
    });

    if (!result) {
      return undefined;
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    if (result.informationBank.networkBank) {
      return CounterpartyBank.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyAchPab.fromPrimitives(result._id.toString(), result);
  }

  async findByClientIdAndCounterPartyIdAndAssetId(
    counterpartyId: string,
    assetId: string,
    clientId: string,
    isInternal?: "S" | "N",
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne<any>({
      counterpartyId,
      assetId,
      clientId,
      ...(isInternal && { isInternal }),
    });

    if (!result) {
      return undefined;
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    if (result.informationBank.networkBank) {
      return CounterpartyBank.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyAchPab.fromPrimitives(result._id.toString(), result);
  }

  async list(
    criteria: Criteria,
    assetCode?: string,
  ): Promise<Paginate<Counterparty> | undefined> {
    let document: any[] = await this.searchByCriteria<any>(criteria);

    document = document.map((d): Counterparty => {
      if (d.counterpartyType === CounterpartyType.CRYPTO) {
        return CounterpartyAsset.fromPrimitives(d._id.toString(), d);
      }

      if (assetCode && assetCode === "USD_PA") {
        return CounterpartyAchPab.fromPrimitives(d._id.toString(), d);
      }

      return CounterpartyBank.fromPrimitives(d._id.toString(), d);
    });

    return this.buildPaginate<Counterparty>(document);
  }

  async upsert(counterparty: Counterparty): Promise<void> {
    await this.persist(counterparty.getId(), counterparty);
  }

  async findByClientIdAndAddressPayment(
    clientId: string,
    addressPayment: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
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

  async findMyCounterpartyByAssetId(
    clientId: string,
    counterpartyId: string,
    assetId: string,
  ): Promise<Counterparty | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      clientId: clientId,
      counterpartyId,
      assetId,
    });

    if (!result) {
      return undefined;
    }

    if (result.achInstructions) {
      console.log("achInstructions", result.achInstructions);
      return CounterpartyAchPab.fromPrimitives(result._id.toString(), result);
    }

    if (result.counterpartyType === CounterpartyType.CRYPTO) {
      return CounterpartyAsset.fromPrimitives(result._id.toString(), result);
    }

    return CounterpartyBank.fromPrimitives(result._id.toString(), result);
  }

  async getPending(): Promise<Counterparty[] | undefined> {
    const collection = await this.collection();
    const result = await collection
      .find<any>({
        status: CounterpartyStatus.PENDING,
      })
      .toArray();

    if (!result) {
      return undefined;
    }

    return result.map((r) => {
      if (r.counterpartyType === CounterpartyType.CRYPTO) {
        return CounterpartyAsset.fromPrimitives(r._id.toString(), r);
      } else {
        return CounterpartyBank.fromPrimitives(r._id.toString(), r);
      }
    });
  }
}
