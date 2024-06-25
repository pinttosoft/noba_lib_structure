import { ReferredDTO } from "./type/referred.type";
import { ReferredStatus } from "./enums/referred_status.enum";
import { AggregateRoot } from "../shared/domain/aggregate_root";

export class Referred extends AggregateRoot {
  constructor(private readonly referred: ReferredDTO) {
    super();
  }

  getTaxId(): string {
    return this.referred.taxId;
  }

  getId(): string {
    return this.referred.id;
  }

  getClientIdToBusinessAllie() {
    return this.referred.referredByClientId;
  }

  setFeeSwap(fee: number) {
    this.referred.feeSwap = fee;
  }

  getFeeSwap(): number {
    return this.referred.feeSwap;
  }

  setStatus(status: ReferredStatus) {
    this.referred.status = status;
  }

  toPrimitives(): ReferredDTO {
    return this.referred;
  }
}
