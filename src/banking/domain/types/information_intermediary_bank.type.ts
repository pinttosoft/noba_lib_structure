import { NetworkBank } from "../enums/network_bank.enum";
import { Address } from "../../../shared";

export type InformationIntermediaryBankDTO = {
  swiftCode: string;
  bankName: string;
  address: Address;
};
