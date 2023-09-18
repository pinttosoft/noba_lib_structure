import { TypeBankDetails } from "../enums/type_bank_details.enum";
import { NetworkBank } from "../enums/network_bank.enum";
import { Address } from "../../../shared";

export type InformationBankDTO = {
  accountNumber: string;
  swiftCode: string;
  IBANOrRoutingNumber: string;
  bankName: string;
  networkBank: NetworkBank;
  address: Address;
};
