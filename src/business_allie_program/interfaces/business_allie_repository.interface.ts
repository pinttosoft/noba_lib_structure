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

  deleteBusinessAllie(clientId: string): void;

  getReferredByTaxId(taxId: string): Promise<Referred | undefined>;

  getReferredAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | undefined>;

  getReferralsByClientId(clientId: string): Promise<ReferredDTO[] | undefined>;

  updateReferredData(referred: Referred): Promise<void>;

  getBusinessAllieByReferredClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null>;

  getReferredByClientId(clientId: string): Promise<Referred | undefined>;

  deleteReferred(referredByClientId: string, clientId: string): void;
}
