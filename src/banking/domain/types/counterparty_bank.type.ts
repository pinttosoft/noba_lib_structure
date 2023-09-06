import { Address } from "../../../shared";
import { TypeBankDetails } from "../enums/type_bank_details.enum";
import {NetworkBank} from "../enums/network_bank.enum";

export type CounterpartyBankDTO = {
  id?: string;
  accountNumber: string
  counterpartyId: string;
  counterpartyType: string;
  clientId: string;
  accountId: string;
  routingNumber?: string;
  swiftCode?: string;
  informationOwner: { name: string; address: Address };
  informationBank: {
    type: TypeBankDetails;
    bankName: string;
    networkBank: NetworkBank;
    address: Address;
  };
};
