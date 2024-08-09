import { BusinessAllieDTO } from "./type/business_allie.type";
import { AggregateRoot } from "../shared/domain/aggregate_root";
import { BusinessAllieStatus } from "./enums/business_allie_status.enum";
import { FeeLimitsType } from "./type/fee_limits.type";
import { DiffusionChannels } from "./enums/diffussion_channels.enum";
import { Referred } from "./referred";
import { ReferredDTO } from "./type/referred.type";
import { BusinessAllieType } from "./enums/business_allie_type.enum";
import { AccountType } from "../account";

export class BusinessAllie extends AggregateRoot {
  id?: string;
  clientId?: string;
  name: string;
  email: string;
  referrals?: ReferredDTO[];
  status: BusinessAllieStatus;
  type: BusinessAllieType;
  createdAt: Date;
  diffusionChanel?: DiffusionChannels;
  link?: string;
  referredBy?: string;
  updatedAt?: Date;
  approvedAt?: Date;
  feeLimits?: FeeLimitsType;
  accountType?: AccountType;

  static newAllie(alliePayload: BusinessAllieDTO): BusinessAllie {}

  static fromPrimitives(id: string, data: any): BusinessAllie {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getClientId(): string {
    return this.clientId;
  }

  getFeeLimits(): FeeLimitsType {
    return this.feeLimits;
  }

  getReferrals(): ReferredDTO[] {
    return this.referrals;
  }

  getStatus(): BusinessAllieStatus {
    return this.status;
  }

  setReferrals(referrals: Referred[]): void {
    this.referrals = referrals.map((r) => r.toPrimitives());
  }

  updateStatus(status: BusinessAllieStatus): void {
    this.status = status;
  }

  updateFeeLimits(feeLimits: FeeLimitsType): void {
    this.feeLimits = feeLimits;
  }

  updateLink(link: string): void {
    this.link = link;
  }

  updateDiffusionChanel(diffusionChanel: DiffusionChannels): void {
    this.diffusionChanel = diffusionChanel;
  }

  toPrimitives(): BusinessAllieDTO {
    return this;
  }
}
