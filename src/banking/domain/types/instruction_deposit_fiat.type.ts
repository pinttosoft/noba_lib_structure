export type InstructionDepositFiat = {
  id: string;
  label: string;
  WIRE: {
    holderName: string;
    accountNumber: string;
    accountRoutingNumber: string;
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
  ACH: {
    holderName: string;
    accountNumber: string;
    accountRoutingNumber: string;
    memo: string;
  };
};
