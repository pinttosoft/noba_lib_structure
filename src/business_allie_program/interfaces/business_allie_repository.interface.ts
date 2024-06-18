import { BusinessAllieDTO } from "../type/business_allie.type";
import { BusinessAllie } from "../business_allie";
import { ReferredDTO } from "../type/business_opportunity.type";
import { Referred } from "../referred";

export interface IBusinessAllieRepository {
  saveBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  getBusinessAllie(clientId: string): Promise<BusinessAllieDTO | undefined>;

  getOpportunityByTaxId(taxId: string): Promise<Referred | undefined>;

  addOpportunityToAllie(
    clientId: string,
    opportunityPayload: ReferredDTO,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | undefined>;

  getAllieOpportunitiesByClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO[] | undefined>;

  updateBusinessOpportunityData(opportunity: Referred): Promise<void>;

  getBusinessAllieByOpportunityClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityByClientId(clientId: string): Promise<Referred | undefined>;
}
