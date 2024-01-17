export type InstructionDepositFiat = {
  id: string;
  label: string;
  // todo check with angel
  WIRE?: {
    holderName: string;
    accountNumber: string;
    accountRoutingNumber: string;
    bankName: string;
    memo: string;
    holderAddress: {
      addressLine1: string;
      city: string;
      state: string;
      postal_code: string;
      country_code: string;
    };
    institutionAddress: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      postal_code: string;
      country_code: string;
    };
  };
  ACH?: {
    holderName: string;
    accountNumber: string;
    accountRoutingNumber: string;
    memo: string;
  };
  ACH_PAB?: {
    accountDestinationNumber: string;
    bankName: string;
    productType: string;
    holderId: string;
    holderName: string;
    holderEmail: string;
    concept: string;
  };
};
