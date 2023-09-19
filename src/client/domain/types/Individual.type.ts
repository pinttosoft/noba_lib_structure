import { ResidencyStatus } from "../enums/residency_status";
import { Address, ContactInformation } from "../../../shared";
import { DocumentType } from "../../../documents";

type individualType = {
  firstName: string;
  dni: string;
  middleName?: string;
  lastName: string;
  taxId?: string;
  passport?: string;
  dateBirth?: Date;
  kyc?: {
    cipChecks: string;

    kycRequiredActions: { [key: string]: string };
  };
  residencyStatus: ResidencyStatus;
  documents: {
    patch: string;
    documentType: DocumentType;
  }[];
};

export type IndividualDTO = individualType & Address & ContactInformation;
