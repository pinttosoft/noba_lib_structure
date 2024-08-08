import { IBusinessAllieRepository } from "../../interfaces/business_allie_repository.interface";
import { BusinessAllieDTO } from "../../type/business_allie.type";
import { BusinessAllie } from "../../business_allie";
import { ReferredDTO } from "../../type/referred.type";
import { Referred } from "../../referred";
import {
  Criteria,
  MongoClientFactory,
  MongoRepository,
  Paginate,
} from "../../../shared";

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

  async fetchBusinessAllies(
    criteria: Criteria,
  ): Promise<Paginate<BusinessAllie>> {
    const document = await this.searchByCriteria<any>(criteria);

    return this.buildPaginate<BusinessAllie>(document);
  }

  async getBusinessAllie(clientId: string): Promise<BusinessAllie | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ clientId });

    if (!result) {
      return undefined;
    }

    return new BusinessAllie({ ...result, id: result._id } as BusinessAllieDTO);
  }

  async upsertBusinessAllie(businessAllie: BusinessAllie): Promise<void> {
    await this.persist(businessAllie.getId(), businessAllie);
  }

  async addReferredToAllie(
    clientId: string,
    referredPayload: ReferredDTO,
  ): Promise<BusinessAllie | null> {
    const collection = await this.collection();

    await collection.updateOne(
      { clientId },
      { $push: { referrals: referredPayload } },
      { upsert: true },
    );

    const result = (await collection.findOne<any>({
      clientId,
    })) as unknown as BusinessAllieDTO;

    return new BusinessAllie(result);
  }

  async updateReferredData(referred: Referred): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      {
        clientId: referred.getClientIdToBusinessAllie(),
        "referrals.taxId": referred.getTaxId(),
      },
      {
        $set: {
          ...this.transformationToUpsertInSubDocuments(
            "referrals",
            referred.toPrimitives(),
          ),
        },
      },
    );
  }

  async getReferralsByClientId(clientId: string): Promise<Referred[] | null> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ clientId });
    if (!result) {
      return null;
    }

    return result.referrals.map((r) => new Referred(r));
  }

  async getReferredAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllie | null> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "referrals.taxId": taxId,
    });

    if (!result) {
      return undefined;
    }

    return new BusinessAllie({ ...result, id: result._id } as BusinessAllieDTO);
  }

  async getBusinessAllieByReferredClientId(
    clientId: string,
  ): Promise<BusinessAllie | null> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "referrals.clientId": clientId,
    });

    return new BusinessAllie({ ...result, id: result._id } as BusinessAllieDTO);
  }

  async getReferredByTaxId(taxId: string): Promise<Referred | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>(
      { "referrals.taxId": taxId },
      { projection: { "referrals.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const referred = result.referrals[0];

    return new Referred({ ...referred, id: referred._id });
  }

  async getReferredByEmail(email: string): Promise<Referred | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>(
      { "referrals.email": email },
      { projection: { "referrals.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const referred = result.referrals[0];

    return new Referred({ ...referred, id: referred._id });
  }

  async getReferredByClientId(clientId: string): Promise<Referred | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>(
      { "referrals.clientId": clientId },
      { projection: { "referrals.$": 1 } },
    );

    if (!result) {
      return undefined;
    }

    const referred = result.referrals[0];

    return new Referred({ ...referred, id: referred._id });
  }

  async deleteBusinessAllie(clientId: string) {
    const collection = await this.collection();
    await collection.deleteOne({ clientId });
  }

  async deleteReferred(referredByClientId: string, clientId: string) {
    const oldReferrals: Referred[] =
      await this.getReferralsByClientId(referredByClientId);

    const newReferrals: Referred[] = oldReferrals.filter(
      (referred: Referred): boolean => referred.getClientId() !== clientId,
    );

    const allieRes = await this.getBusinessAllie(referredByClientId);
    const allie = new BusinessAllie(
      allieRes.toPrimitives() as BusinessAllieDTO,
    );
    allie.setReferrals(newReferrals);

    await this.upsertBusinessAllie(allie);
  }

  /**
   * Pagina el listado general de Referidos
   * @param criteria
   */
  async fetchReferrals(criteria: Criteria): Promise<Paginate<ReferredDTO>> {
    const collection = await this.collection();
    const skip = (criteria.currentPage - 1) * criteria.limit;

    const filters = this.criteriaConverter.convert(criteria).filter;

    const pipeline = [
      { $unwind: "$referrals" },
      { $replaceRoot: { newRoot: "$referrals" } },
      { $match: filters },
      {
        $facet: {
          totalCount: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: criteria.limit },
            { $match: filters },
          ],
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();

    const totalCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;
    const data = result[0].data.map((r: any) => r);

    const hasNextPage = criteria.currentPage * criteria.limit < totalCount;

    return {
      nextPag: hasNextPage ? criteria.currentPage + 1 : null,
      prevPag: criteria.currentPage > 1 ? criteria.currentPage - 1 : null,
      count: totalCount,
      results: result[0].data,
    };
  }

  async exportAllies(criteria: Criteria): Promise<BusinessAllie[]> {
    const collection = await this.collection();

    const pipeline = [];

    if (criteria.hasFilters()) {
      const query = this.criteriaConverter.convert(criteria);
      pipeline.push({ $match: query.filter });
    }

    return (await collection.aggregate(pipeline).toArray()) as BusinessAllie[];
  }

  async exportReferrals(criteria: Criteria): Promise<Referred[]> {
    const collection = await this.collection();
    const pipeline = [];

    if (criteria.hasFilters()) {
      const query = this.criteriaConverter.convert(criteria);
      pipeline.push({ $match: query.filter });
    }

    pipeline.push(
      { $unwind: "$referrals" },
      { $replaceRoot: { newRoot: "$referrals" } },
    );

    return (await collection.aggregate(pipeline).toArray()) as Referred[];
  }
}
