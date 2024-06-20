import { IBusinessAllieRepository } from "../../interfaces/business_allie_repository.interface";
import { BusinessAllieDTO } from "../../type/business_allie.type";
import { BusinessAllie } from "../../business_allie";
import { ReferredDTO } from "../../type/referred.type";
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

  async upsertBusinessAllie(businessAllie: BusinessAllie): Promise<void> {
    await this.persist(businessAllie.getId(), businessAllie);
  }

  async addReferredToAllie(
    clientId: string,
    referredPayload: ReferredDTO,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    await collection.updateOne(
      { clientId },
      { $push: { referrals: referredPayload } },
      { upsert: true },
    );

    return (await collection.findOne<any>({
      clientId,
    })) as unknown as BusinessAllieDTO;
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

  async getReferralsByClientId(
    clientId: string,
  ): Promise<ReferredDTO[] | null> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ clientId });
    if (!result) {
      return null;
    }

    return result.referrals;
  }

  async getReferredAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    return (await collection.findOne<any>({
      "referrals.taxId": taxId,
    })) as unknown as BusinessAllieDTO;
  }

  async getBusinessAllieByReferredClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null> {
    const collection = await this.collection();

    return (await collection.findOne<any>({
      "referrals.clientId": clientId,
    })) as unknown as BusinessAllieDTO;
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
    const collection = await this.collection();

    const oldReferrals: ReferredDTO[] =
      await this.getReferralsByClientId(referredByClientId);
    // console.log("oldReferrals", oldReferrals);

    const newReferrals: ReferredDTO[] = oldReferrals.filter(
      (referred: ReferredDTO): boolean => referred.clientId !== clientId,
    );

    const allieRes = await this.getBusinessAllie(referredByClientId);
    const allie = new BusinessAllie(allieRes);
    allie.setReferrals(newReferrals);

    await this.upsertBusinessAllie(allie);
    // console.log("newReferrals", newReferrals);
  }
}
