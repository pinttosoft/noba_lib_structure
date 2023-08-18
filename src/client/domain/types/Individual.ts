import { ResidencyStatus } from "../enums/residency_status";

export type Individual = {
  accountId?: string;
  firstName: string;
  dni: string;
  middleName?: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  phoneCountry: string;
  taxId?: string;
  passport?: string;
  dateBirth?: Date;
  kyc: {
    cipChecks: string;

    kycRequiredActions: { [key: string]: string };
  };
  residencyStatus: ResidencyStatus;
  streetOne: string;
  streetTwo: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
};
