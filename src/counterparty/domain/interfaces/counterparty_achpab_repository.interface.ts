import { CounterpartyAchPab } from "../../../banking";

export interface CounterpartyAchPabRepositoryInterface {
  upsert(counterparty: CounterpartyAchPab): Promise<void>;

  findMyCounterpartyByAssetId(
    clientId: string,
    counterpartyId: string,
    assetId: string,
  ): Promise<CounterpartyAchPab | undefined>;
}
