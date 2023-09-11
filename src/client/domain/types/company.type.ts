import { Address, ContactInformation } from "../../../shared";
import { CompanyType } from "../enums/company_type.enum";

type companyType = {
  name: string;
  registerNumber: string;
  naics: string;
  naicsDescription: string;
  companyType: CompanyType;
  established_date: Date;
  webSite: string;
  registeredAddress: Address;
  physicalAddress: Address;
  stateOfIncorporation: string;
  countryOfIncorporation: string;
};

export type CompanyDTO = companyType & ContactInformation;
