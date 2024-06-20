import { BusinessAllieDTO } from "./type/business_allie.type";
import { AggregateRoot } from "../shared/domain/aggregate_root";
import { BusinessAllieStatus } from "./enums/business_allie_status.enum";
import { FeeLimitsType } from "./type/fee_limits.type";

export class BusinessAllie extends AggregateRoot {
  constructor(private readonly businessAllie: BusinessAllieDTO) {
    super();
  }

  getId(): string {
    return this.businessAllie.id;
  }

  updateStatus(status: BusinessAllieStatus): void {
    this.businessAllie.status = status;
  }

  updateFeeLimits(feeLimits: FeeLimitsType): void {
    this.businessAllie.feeLimits = feeLimits;
  }

  toPrimitives(): BusinessAllieDTO {
    return this.businessAllie;
  }
}
