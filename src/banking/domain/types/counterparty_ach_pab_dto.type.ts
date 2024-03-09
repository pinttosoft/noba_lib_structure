import { CounterpartyStatus } from "../../../counterparty";
import { InstructionsAchPabType } from "./instructions_ach_pab.type";
import { Address } from "../../../shared";

export type CounterpartyAchPabDtoType = {
  id?: string;
  assetId: string;
  counterpartyId: string;
  counterpartyType: string;
  clientId: string;
  status: CounterpartyStatus;
  achInstructions: InstructionsAchPabType;
  informationOwner: { name: string; address: Address };
};
