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

  static newAllie(alliePayload: BusinessAllieDTO): BusinessAllie {
    const allie = new BusinessAllie();

    allie.id = alliePayload.id;
    allie.clientId = alliePayload.clientId;
    allie.name = alliePayload.name;
    allie.email = alliePayload.email;
    allie.referrals = alliePayload.referrals;
    allie.status = alliePayload.status;
    allie.type = alliePayload.type;
    allie.createdAt = alliePayload.createdAt;
    allie.diffusionChanel = alliePayload.diffusionChanel;
    allie.link = alliePayload.link;
    allie.referredBy = alliePayload.referredBy;
    allie.updatedAt = alliePayload.updatedAt;
    allie.approvedAt = alliePayload.approvedAt;
    allie.feeLimits = alliePayload.feeLimits;
    allie.accountType = alliePayload.accountType;

    return allie;
  }

  static fromPrimitives(id: string, data: any): BusinessAllie {
    const allie = new BusinessAllie();

    allie.id = id;
    allie.clientId = data.clientId;
    allie.name = data.name;
    allie.email = data.email;
    allie.referrals = data.referrals;
    allie.status = data.status;
    allie.type = data.type;
    allie.createdAt = data.createdAt;
    allie.diffusionChanel = data.diffusionChanel;
    allie.link = data.link;
    allie.referredBy = data.referredBy;
    allie.updatedAt = data.updatedAt;
    allie.approvedAt = data.approvedAt;
    allie.feeLimits = data.feeLimits;
    allie.accountType = data.accountType;

    return allie;
  }

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
    return {
      id: this.id,
      clientId: this.clientId,
      name: this.name,
      email: this.email,
      referrals: this.referrals,
      status: this.status,
      type: this.type,
      createdAt: this.createdAt,
      diffusionChanel: this.diffusionChanel,
      link: this.link,
      referredBy: this.referredBy,
      updatedAt: this.updatedAt,
      approvedAt: this.approvedAt,
      feeLimits: this.feeLimits,
      accountType: this.accountType,
    };
  }
}
