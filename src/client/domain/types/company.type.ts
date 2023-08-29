import { AddressAndContactData } from "@/shared/domain/types/address_contact_data.type";

type companyType = {
  name: string;
  email: string;
  taxId: string;
  registerNumber: string;
  taxCountry: string;
};

export type CompanyDTO = companyType & AddressAndContactData;
