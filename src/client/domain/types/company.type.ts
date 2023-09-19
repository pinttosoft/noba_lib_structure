import { Address, ContactInformation } from "../../../shared";
import { CompanyType } from "../enums/company_type.enum";
import { DocumentType } from "../../../documents";

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
  documents: {
    patch: string;
    documentType: DocumentType;
  }[];
};

export type CompanyDTO = companyType & ContactInformation;
