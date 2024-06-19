import { BusinessAllieDTO } from "../type/business_allie.type";
import { BusinessAllie } from "../business_allie";
import { ReferredDTO } from "../type/referred.type";
import { Referred } from "../referred";

export interface IBusinessAllieRepository {
  saveBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  getBusinessAllie(clientId: string): Promise<BusinessAllieDTO | undefined>;

  getReferredByTaxId(taxId: string): Promise<Referred | undefined>;

  addReferredToAllie(
    clientId: string,
    referredByPayload: ReferredDTO,
  ): Promise<BusinessAllieDTO | null>;

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
