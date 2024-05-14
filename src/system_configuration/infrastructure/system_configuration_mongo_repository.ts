import { ISystemConfigurationRepository } from "../domain/interfaces/system_configuration_repository.interface";
import { FeeSwapDTO } from "../domain/types/fee_swap.type";
import { FeeWireDTO } from "../domain/types/fee_wire.type";
import { FeeSwapForProgramReferralsDTO } from "../domain/types/fee_swap_for_program_referrals.type";
import { MongoClientFactory, MongoRepository } from "../../shared";
import { FeeSwap } from "../domain/fee_swap";
import { FeeSwapForProgramReferrals } from "../domain/fee_swap_for_program_referrals";
import { FeeWire } from "../domain/fee_wire";
import { ObjectId } from "mongodb";
import { FeeACHPanama } from "../domain/feeACHPanama";
import { FeeACHPAB } from "../domain/types/fee_ach_pab.type";
import { FeeAchUsd } from "../domain/fee_ach_usd";
import { CommissionForRechargingCard } from "../domain/commission_for_recharging_card";

type SystemConfig = {
  _id: ObjectId;
  feeSwap: FeeSwapDTO;
  feeWire: FeeWireDTO;
  feeACHPanama: FeeACHPAB;
  FeeSwapForProgramReferrals: FeeSwapForProgramReferralsDTO;
  feeRechargingCard: CommissionForRechargingCard;
  feeAchUsd: FeeAchUsd;
};

export class SystemConfigurationMongoRepository
  extends MongoRepository<any>
  implements ISystemConfigurationRepository
{
  private static _instance: SystemConfigurationMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance(): ISystemConfigurationRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SystemConfigurationMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "system_configuration";
  }

  async getDefaultFeeSwap(): Promise<FeeSwap> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeSwap.fromPrimitives(result.feeSwap);
  }

  async getDefaultFeeWire(): Promise<FeeWire> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeWire.fromPrimitives(result.feeWire);
  }

  async getDefaultFeeACHPAB(): Promise<FeeACHPanama> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
    }

    return FeeACHPanama.fromPrimitives(result.feeACHPanama);
  }

  async getDefaultFeeRechargingCard(): Promise<CommissionForRechargingCard> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    return CommissionForRechargingCard.fromPrimitives(result.feeRechargingCard);
  }

  getFeeNobaForSwapOfBusinessOpportunities(): Promise<number> {
    return Promise.resolve(0);
  }

  getFeeSwapProgramReferrals(): Promise<FeeSwapForProgramReferrals> {
    return Promise.resolve(undefined);
  }

  getIntegratorSwapFee(): Promise<FeeSwap> {
    return Promise.resolve(undefined);
  }

  getNobaFee(): Promise<FeeSwap> {
    return Promise.resolve(undefined);
  }

  async getDefaultFeeAchUsd(): Promise<FeeAchUsd> {
    const collection = await this.collection();

    const result = await collection.findOne<SystemConfig>();

    if (!result) {
      return undefined;
    }

    return FeeAchUsd.fromPrimitives(result.feeAchUsd);
  }
}
