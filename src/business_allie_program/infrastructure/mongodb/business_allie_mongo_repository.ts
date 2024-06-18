import { IBusinessAllieRepository } from "../../interfaces/business_allie_repository.interface";
import { BusinessAllieDTO } from "../../type/business_allie.type";
import { BusinessAllie } from "../../business_allie";
import { ReferredDTO } from "../../type/business_opportunity.type";
import { Referred } from "../../referred";
import { MongoClientFactory, MongoRepository } from "../../../shared";

export class BusinessAllieMongoRepository
  extends MongoRepository<BusinessAllie>
  implements IBusinessAllieRepository
{
  private static _instance: BusinessAllieMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BusinessAllieMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "business_allie";
  }

  async getBusinessAllie(
    clientId: string,
  ): Promise<BusinessAllieDTO | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ clientId });

    if (!result) {
      return undefined;
    }

    return { ...result, id: result._id } as unknown as BusinessAllieDTO;
  }

  async saveBusinessAllie(businessAllie: BusinessAllie): Promise<void> {
    await this.persist(businessAllie.getId(), businessAllie);
  }

  async addOpportunityToAllie(
    clientId: string,
    opportunityPayload: ReferredDTO,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    await collection.updateOne(
      { clientId },
      { $push: { businessOpportunities: opportunityPayload } },
      { upsert: true },
    );

    return (await collection.findOne<any>({
      clientId,
    })) as unknown as BusinessAllieDTO;
  }

  async updateBusinessOpportunityData(opportunity: Referred): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      {
        clientId: opportunity.getClientIdToBusinessAllie(),
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

    return (await collection.findOne<any>({
      "businessOpportunities.taxId": taxId,
    })) as unknown as BusinessAllieDTO;
  }

  async getBusinessAllieByOpportunityClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    return (await collection.findOne<any>({
      "businessOpportunities.clientId": clientId,
    })) as unknown as BusinessAllieDTO;
  }

  async getAllieOpportunitiesByClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO[] | null> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ clientId });
    if (!result) {
      return null;
    }

    return result.businessOpportunities;
  }

  async getOpportunityByTaxId(taxId: string): Promise<Referred | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>(
      { "businessOpportunities.taxId": taxId },
      { projection: { "businessOpportunities.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const opportunity = result.businessOpportunities[0];

    return new Referred({ ...opportunity, id: opportunity._id });
  }

  async getOpportunityByClientId(
    clientId: string,
  ): Promise<Referred | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>(
      { "businessOpportunities.clientId": clientId },
      { projection: { "businessOpportunities.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const opportunity = result.businessOpportunities[0];

    return new Referred({ ...opportunity, id: opportunity._id });
  }
}
