import { BusinessOpportunityDTO } from "./type/business_opportunity.type";
import { BusinessOpportunityStatus } from "./enums/business_opportunity_status.enum";
import { AggregateRoot } from "../shared/domain/aggregate_root";

export class BusinessOpportunity extends AggregateRoot {
  constructor(private readonly businessOpportunity: BusinessOpportunityDTO) {
    super();
  }

  getTaxId(): string {
    return this.businessOpportunity.taxId;
  }
  getId(): string {
    return this.businessOpportunity.id;
  }

  getAccountIdToBusinessAllie() {
    return this.businessOpportunity.referredByAccountId;
  }

  setFeeSwap(fee: number) {
    this.businessOpportunity.feeSwap = fee;
  }

  getFeeSwap(): number {
    return this.businessOpportunity.feeSwap;
  }

  setStatus(status: BusinessOpportunityStatus) {
    this.businessOpportunity.status = status;
  }

  toPrimitives(): BusinessOpportunityDTO {
    return this.businessOpportunity;
  }
}
