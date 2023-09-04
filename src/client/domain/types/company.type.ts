import { Address, ContactInformation } from "../../../shared";
import { CompanyType } from "../enums/company_type.enum";

type companyType = {
  name: string;
  taxId: string;
  registerNumber: string;
  taxCountry: string;
  naics: string;
  naicsDescription: string;
  companyType: CompanyType;
  established_date: Date;
};

export type CompanyDTO = companyType & Address & ContactInformation;
