import { IBusinessAllieRepository } from "../../interfaces/business_allie_repository.interface";
import { BusinessAllieDTO } from "../../type/business_allie.type";
import { BusinessAllie } from "../../business_allie";
import { BusinessOpportunityDTO } from "../../type/business_opportunity.type";
import { BusinessOpportunityStatus } from "../../enums/business_opportunity_status.enum";
import { BusinessOpportunity } from "../../business_opportunity";
import { MongoClientFactory, MongoRepository } from "../../../shared";

export class Business_allie_mongo_repository
  extends MongoRepository<BusinessAllie>
  implements IBusinessAllieRepository
{
  constructor() {
    super(MongoClientFactory.createClient());
  }
  collectionName(): string {
    return "business_allie";
  }
  private static _instance: Business_allie_mongo_repository;

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Business_allie_mongo_repository();
    return this._instance;
  }
  async getBusinessAllie(
    accountId: string,
  ): Promise<BusinessAllieDTO | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ accountId });

    if (!result) {
      return undefined;
    }

    return { ...result, id: result._id } as unknown as BusinessAllieDTO;
  }

  async saveBusinessAllie(businessAllie: BusinessAllie): Promise<void> {
    await this.persist(businessAllie.getId(), businessAllie);
  }

  async addOpportunityToAllie(
    accountId: string,
    opportunityPayload: BusinessOpportunityDTO,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    await collection.updateOne(
      { accountId },
      { $push: { businessOpportunities: opportunityPayload } },
      { upsert: true },
    );

    return (await collection.findOne({
      accountId,
    })) as unknown as BusinessAllieDTO;
  }

  async updateBusinessOpportunityData(
    opportunity: BusinessOpportunity,
  ): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      {
        accountId: opportunity.getAccountIdToBusinessAllie(),
        "businessOpportunities.taxId": opportunity.getTaxId(),
      },
      {
        $set: {
          ...this.transformationToUpsertInSubDocuments(
            "businessOpportunities",
            opportunity.toPrimitives(),
          ),
        },
      },
    );
  }

  async getOpportunityAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    return (await collection.findOne({
      "businessOpportunities.taxId": taxId,
    })) as unknown as BusinessAllieDTO;
  }

  async getBusinessAllieByOpportunityAccountId(
    accountId: string,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    return (await collection.findOne({
      "businessOpportunities.accountId": accountId,
    })) as unknown as BusinessAllieDTO;
  }

  async getAllieOpportunitiesByAccountId(
    accountId: string,
  ): Promise<BusinessAllieDTO[] | null> {
    const collection = await this.collection();
    const result = await collection.findOne({ accountId });
    if (!result) {
      return null;
    }

    return result.businessOpportunities;
  }

  async getOpportunityByTaxId(
    taxId: string,
  ): Promise<BusinessOpportunity | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne(
      { "businessOpportunities.taxId": taxId },
      { projection: { "businessOpportunities.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const opportunity = result.businessOpportunities[0];

    return new BusinessOpportunity({ ...opportunity, id: opportunity._id });
  }

  async getOpportunityByAccountId(
    accountId: string,
  ): Promise<BusinessOpportunity | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne(
      { "businessOpportunities.accountId": accountId },
      { projection: { "businessOpportunities.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const opportunity = result.businessOpportunities[0];

    return new BusinessOpportunity({ ...opportunity, id: opportunity._id });
  }
}
