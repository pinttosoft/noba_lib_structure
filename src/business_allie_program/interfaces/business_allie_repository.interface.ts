import { BusinessAllieDTO } from "../type/business_allie.type";
import { BusinessAllie } from "../business_allie";
import { BusinessOpportunityStatus } from "../enums/business_opportunity_status.enum";
import { BusinessOpportunityDTO } from "../type/business_opportunity.type";
import { BusinessOpportunity } from "../business_opportunity";

export interface IBusinessAllieRepository {
  saveBusinessAllie(businessAllie: BusinessAllie): Promise<void>;

  getBusinessAllie(accountId: string): Promise<BusinessAllieDTO | undefined>;

  getOpportunityByTaxId(
    taxId: string,
  ): Promise<BusinessOpportunity | undefined>;

  addOpportunityToAllie(
    accountId: string,
    opportunityPayload: BusinessOpportunityDTO,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityAndAllieByTaxId(
    taxId: string,
  ): Promise<BusinessAllieDTO | undefined>;

  getAllieOpportunitiesByAccountId(
    accountId: string,
  ): Promise<BusinessAllieDTO[] | undefined>;

  updateBusinessOpportunityData(
    opportunity: BusinessOpportunity,
  ): Promise<void>;

  getBusinessAllieByOpportunityAccountId(
    accountId: string,
  ): Promise<BusinessAllieDTO | null>;

  getOpportunityByAccountId(
    accountId: string,
  ): Promise<BusinessOpportunity | undefined>;
}
