import { BusinessAllieDTO } from "../type/business_allie.type";
import { BusinessAllie } from "../business_allie";
import { ReferredDTO } from "../type/referred.type";
import { Referred } from "../referred";

export interface IBusinessAllieRepository {
  getBusinessAllie(clientId: string): Promise<BusinessAllieDTO | undefined>;

  upsertBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  addReferredToAllie(
    clientId: string,
    referredByPayload: ReferredDTO,
  ): Promise<BusinessAllieDTO | null>;

  getReferredByTaxId(taxId: string): Promise<Referred | undefined>;

  getReferredAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | undefined>;

  getAllieReferralsByClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO[] | undefined>;

  updateReferredData(referred: Referred): Promise<void>;

  getBusinessAllieByReferredClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null>;

  getReferredByClientId(clientId: string): Promise<Referred | undefined>;
}
