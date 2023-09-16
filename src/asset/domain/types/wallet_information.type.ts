import { OriginWallet } from "../../../wallet";
import { Address } from "../../../shared";
import { RelationshipConsumer } from "../../../counterparty";

export type WalletInformationDTO = {
  assetId: string;
  address: string;
  relationshipConsumer: RelationshipConsumer;
  originWallet: OriginWallet;
  institutionName?: string;
  institutionAddress?: Address;
};
