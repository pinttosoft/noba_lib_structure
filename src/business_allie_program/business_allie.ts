import { BusinessAllieDTO } from "./type/business_allie.type";
import { AggregateRoot } from "../shared/domain/aggregate_root";

export class BusinessAllie extends AggregateRoot {
  constructor(private readonly businessAllie: BusinessAllieDTO) {
    super();
  }

  getId(): string {
    return this.businessAllie.id;
  }

  toPrimitives(): BusinessAllieDTO {
    return this.businessAllie;
  }
}
