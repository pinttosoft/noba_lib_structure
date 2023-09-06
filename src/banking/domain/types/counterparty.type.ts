import { Address } from "../../../shared";
import { TypeBankDetails } from "../enums/type_bank_details.enum";

export type CounterpartyDTO = {
  id?: string;
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
    networkBank: string;
    address: Address;
  };
};
