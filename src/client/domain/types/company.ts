import { AddressAndContactData } from "@/shared/domain/types/address_contact_data.type";

type company = {
  name: string;
  email: string;
  taxId: string;
  taxCountry: string;
};

export type Company = company & AddressAndContactData;
