import {
  MongoClientFactory,
  MongoRepository,
} from "@/shared/infrastructure/mongodb";
import { BeneficiaryAsset } from "@/beneficiary/domain/beneficiary_asset";
import { Paginate } from "@/shared/domain/types/paginate";
import { IBeneficiaryAssetRepository } from "@/beneficiary";
import {
  Criteria,
  Filters,
  Operator,
  Order,
  OrderTypes,
} from "@/shared/domain/criteria";
import { ObjectId } from "mongodb";

export class BeneficiaryAssetMongoRepository
  extends MongoRepository<BeneficiaryAsset>
  implements IBeneficiaryAssetRepository
{
  private static _instance: BeneficiaryAssetMongoRepository;

  collectionName(): string {
    return "asset_beneficiary";
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BeneficiaryAssetMongoRepository();
    return this._instance;
  }

  async findBeneficiariesByAccountId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<BeneficiaryAsset> | null> {
    const filterAccountId: Map<string, string> = new Map([
      ["field", "accountId"],
      ["operator", Operator.EQUAL],
      ["value", accountId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterAccountId]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      Number(initDoc),
    );

    const document = await this.searchByCriteria<BeneficiaryAsset>(criteria);

    return this.buildPaginate<BeneficiaryAsset>(document);
  }

  async findBeneficiaryByAddressAndAccountId(
    accountId: string,
    address: string,
  ): Promise<BeneficiaryAsset | null> {
    const collection = await this.collection();
    const result = await collection.findOne({
      accountId: accountId,
      walletAddress: address,
    });

    if (!result) {
      return null;
    }

    return BeneficiaryAsset.fromPrimitives(result._id.toString(), {
      ...result,
    });
  }

  async findBeneficiaryById(
    beneficiaryId: string,
  ): Promise<BeneficiaryAsset | null> {
    const objectId = new ObjectId(beneficiaryId);

    const collection = await this.collection();
    const result = await collection.findOne({ _id: objectId });

    if (!result) {
      return null;
    }

    return BeneficiaryAsset.fromPrimitives(result._id.toString(), {
      ...result,
    });
  }

  async upsertAssetBeneficiary(
    beneficiary: BeneficiaryAsset,
  ): Promise<string | void> {
    await this.persist(beneficiary.getId(), beneficiary);
  }
}
