import { Address, ContactInformation } from "../../../shared";

type companyType = {
  name: string;
  taxId: string;
  registerNumber: string;
  taxCountry: string;
};

export type CompanyDTO = companyType & Address & ContactInformation;
