import { ResidencyStatus } from "../enums/residency_status";
import { Address, ContactInformation } from "../../../shared";

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
};

export type IndividualDTO = individualType & Address & ContactInformation;
