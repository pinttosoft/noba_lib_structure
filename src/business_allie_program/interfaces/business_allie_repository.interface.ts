import { BusinessAllieDTO } from "../type/business_allie.type";
import { BusinessAllie } from "../business_allie";
import { BusinessOpportunityDTO } from "../type/business_opportunity.type";
import { BusinessOpportunity } from "../business_opportunity";

export interface IBusinessAllieRepository {
  saveBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  getBusinessAllie(clientId: string): Promise<BusinessAllieDTO | undefined>;

  getOpportunityByTaxId(
    taxId: string,
  ): Promise<BusinessOpportunity | undefined>;

  addOpportunityToAllie(
    clientId: string,
    opportunityPayload: BusinessOpportunityDTO,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | undefined>;

  getAllieOpportunitiesByClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO[] | undefined>;

  updateBusinessOpportunityData(
    opportunity: BusinessOpportunity,
  ): Promise<void>;

  getBusinessAllieByOpportunityClientId(
    clientId: string,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityByClientId(
    clientId: string,
  ): Promise<BusinessOpportunity | undefined>;
}
