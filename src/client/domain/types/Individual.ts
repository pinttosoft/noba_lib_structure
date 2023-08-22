import { ResidencyStatus } from "../enums/residency_status";
import { AddressAndContactData } from "../../../shared/domain/types/address_contact_data.type";

type individual = {
  firstName: string;
  dni: string;
  middleName?: string;
  lastName: string;
  email: string;
  taxId?: string;
  passport?: string;
  dateBirth?: Date;
  kyc: {
    cipChecks: string;

    kycRequiredActions: { [key: string]: string };
  };
  residencyStatus: ResidencyStatus;
};

export type Individual = individual & AddressAndContactData;
