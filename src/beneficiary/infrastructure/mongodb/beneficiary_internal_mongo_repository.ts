import { MongoRepository } from "@/shared/infrastructure/mongodb/MongoRepository";
import {
  BeneficiaryDTO,
  BeneficiaryInternal,
  IBeneficiaryInternalRepository,
} from "@/beneficiary";
import { MongoClientFactory } from "@/shared/infrastructure/mongodb";
import { Criteria } from "@/shared/domain/criteria";
import { Paginate } from "@/shared/domain/types/paginate";

export class Beneficiary_internal_mongo_repository
  extends MongoRepository<BeneficiaryInternal>
  implements IBeneficiaryInternalRepository
{
  private static _instance: Beneficiary_internal_mongo_repository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public collectionName(): string {
    return "beneficiary_internal";
  }

  public static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Beneficiary_internal_mongo_repository();
    return this._instance;
  }

  async findByAccountIdAndType(
    criteria: Criteria,
  ): Promise<BeneficiaryInternal | undefined> {
    const document = await this.searchByCriteria<any>(criteria);
    if (document.length === 0) {
      return undefined;
    }

    return BeneficiaryInternal.fromPrimitives({
      accountId: document[0].accountId,
      beneficiaries: document[0].beneficiaries,
      type: document[0].type,
      id: document[0]._id,
    });
  }

  async findBeneficiaryByAccountIdAndEmail(
    accountId: string,
    emailOfBeneficiary: string,
  ): Promise<BeneficiaryDTO | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne(
      { accountId, "beneficiaries.email": emailOfBeneficiary },
      { projection: { "beneficiaries.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    return result.beneficiaries[0] as BeneficiaryDTO;
  }

  async searchBeneficiaryByBeneficiaryAccountId(
    accountId: string,
  ): Promise<BeneficiaryDTO | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne(
      { "beneficiaries.accountTo": accountId },
      { projection: { "beneficiaries.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    return result.beneficiaries[0] as BeneficiaryDTO;
  }

  async findBeneficiariesByAccountIdAndPage(
    accountId: string,
    type: string,
    page = 1,
    perPage = 20,
  ): Promise<Paginate<BeneficiaryDTO>> {
    const collection = await this.collection();

    const result = await collection
      .find({ accountId, type })
      .project({
        beneficiaries: {
          $slice: [(page - 1) * perPage, perPage],
        },
      })
      .toArray();

    if (result.length === 0) {
      return {
        nextPag: null,
        prevPag: null,
        count: 0,
        results: [],
      };
    }

    const beneficiariesCount = await collection
      .find({ accountId, type })
      .project({
        beneficiaries: 1,
      })
      .toArray();

    const count = beneficiariesCount[0].beneficiaries.length;

    const hasNextPage: boolean = page * perPage < count;

    return {
      nextPag: hasNextPage ? Number(page) + 1 : null,
      prevPag: null,
      count: count,
      results: result[0].beneficiaries.map((b: any) => b as BeneficiaryDTO),
    };
  }

  async updateOrAddCommonBeneficiary(
    beneficiary: BeneficiaryInternal,
  ): Promise<void> {
    await this.persist(beneficiary.getId(), beneficiary);
  }
}
