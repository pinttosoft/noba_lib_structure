import { BusinessAllie } from "../business_allie";
import { ReferredDTO } from "../type/referred.type";
import { Referred } from "../referred";
import { Criteria, Paginate } from "../../shared";

export interface IBusinessAllieRepository {
  fetchBusinessAllies(criteria: Criteria): Promise<Paginate<BusinessAllie>>;

  getBusinessAllie(clientId: string): Promise<BusinessAllie | undefined>;

  upsertBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  addReferredToAllie(
    clientId: string,
    referredByPayload: ReferredDTO,
  ): Promise<BusinessAllie | null>;

  deleteBusinessAllie(clientId: string): void;

  getReferredByTaxId(taxId: string): Promise<Referred | undefined>;

  getReferredByEmail(email: string): Promise<Referred | undefined>;

  getReferredAndAllieByTaxId(taxId: string): Promise<BusinessAllie | undefined>;

  getReferralsByClientId(clientId: string): Promise<Referred[] | undefined>;

  updateReferredData(referred: Referred): Promise<void>;

  getBusinessAllieByReferredClientId(
    clientId: string,
  ): Promise<BusinessAllie | null>;

  getReferredByClientId(clientId: string): Promise<Referred | undefined>;

  deleteReferred(referredByClientId: string, clientId: string): void;

  fetchReferrals(criteria: Criteria, pipelines?: any[]): any;

  paginateReferrals(criteria: Criteria): Promise<Paginate<Referred>>;
}
