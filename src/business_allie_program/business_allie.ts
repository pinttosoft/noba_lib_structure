import { BusinessAllieDTO } from "./type/business_allie.type";
import { AggregateRoot } from "../shared/domain/aggregate_root";
import { BusinessAllieStatus } from "./enums/business_allie_status.enum";
import { FeeLimitsType } from "./type/fee_limits.type";
import { IBusinessAllie } from "./interfaces/business_alli.interface";
import { DiffusionChannels } from "./enums/diffussion_channels.enum";
import { Referred } from "./referred";
import { ReferredDTO } from "./type/referred.type";

export class BusinessAllie extends AggregateRoot implements IBusinessAllie {
  constructor(private readonly businessAllie: BusinessAllieDTO) {
    super();
  }

  getId(): string {
    return this.businessAllie.id;
  }

  getName(): string {
    return this.businessAllie.name;
  }

  getClientId(): string {
    return this.businessAllie.clientId;
  }

  getClient() {
    return this.businessAllie.client;
  }

  getFeeLimits(): FeeLimitsType {
    return this.businessAllie.feeLimits;
  }

  getReferrals(): ReferredDTO[] {
    return this.businessAllie.referrals;
  }

  getStatus(): BusinessAllieStatus {
    return this.businessAllie.status;
  }

  setReferrals(referrals: Referred[]): void {
    this.businessAllie.referrals = referrals.map((r) => r.toPrimitives());
  }

  updateStatus(status: BusinessAllieStatus): void {
    this.businessAllie.status = status;
  }

  updateFeeLimits(feeLimits: FeeLimitsType): void {
    this.businessAllie.feeLimits = feeLimits;
  }

  updateLink(link: string): void {
    this.businessAllie.link = link;
  }

  updateDiffusionChanel(diffusionChanel: DiffusionChannels): void {
    this.businessAllie.diffusionChanel = diffusionChanel;
  }

  toPrimitives(): BusinessAllieDTO {
    return this.businessAllie;
  }
}
