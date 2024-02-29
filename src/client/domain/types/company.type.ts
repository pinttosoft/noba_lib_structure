import { Address, ContactInformation } from "../../../shared";
import { CompanyType } from "../enums/company_type.enum";
import { DocumentType } from "../../../documents";
import { CompanyQuestionnaire } from "../../../account";

type companyType = {
  informationCompany: {
    name: string;
    registerNumber: string;
    naics: string;
    naicsDescription: string;
    companyType: CompanyType;
    establishedDate: Date;
    webSite: string;
    registeredAddress: Address;
    physicalAddress: Address;
    phoneCountry: string;
    phoneNumber: string;
  };
  documents: {
    patch: string;
    documentType: DocumentType;
  }[];
  questionnaire: CompanyQuestionnaire;
  partners: any[];
};

export type CompanyDTO = companyType & ContactInformation;
