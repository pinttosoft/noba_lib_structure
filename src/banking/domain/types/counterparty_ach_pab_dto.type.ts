import {
  CounterpartyProfileType,
  CounterpartyStatus,
  RelationshipConsumer,
} from "../../../counterparty";
import { InstructionsAchPabType } from "./instructions_ach_pab.type";

export type CounterpartyAchPabDtoType = {
  id?: string;
  assetId: string;
  counterpartyId: string;
  counterpartyType: string;
  clientId: string;
  accountId: string;
  profileType: CounterpartyProfileType;
  relationshipConsumer: RelationshipConsumer;
  status: CounterpartyStatus;
  achInstructions: InstructionsAchPabType;
};
