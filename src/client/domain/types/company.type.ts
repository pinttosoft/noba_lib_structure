import { Address, ContactInformation } from "../../../shared";
import { CompanyType } from "../enums/company_type.enum";
import { DocumentSide, DocumentType } from "../../../documents";
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
  } & ContactInformation;
  documents: {
    patch: string;
    documentId: string;
    documentType: DocumentType;
    documentSide: DocumentSide;
  }[];
  questionnaire: CompanyQuestionnaire;
  partners: any[];
  email: string;
};

export type CompanyDTO = companyType;
