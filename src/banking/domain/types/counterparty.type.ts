import { Address } from "../../../shared";

export type CounterpartyDTO = {
  id?: string;
  clientId: string;
  accountId: string;
  routingNumber?: string;
  swiftCode?: string;
  informationOwner: { name: string; address: Address };
  informationBank: {
    bankName: string;
    networkBank: string;
    address: Address;
  };
};
