export type InstructionDepositFiat = {
  id: string;
  label: string;
  WIRE: {
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
  ACH: {
    holderName: string;
    accountNumber: string;
    accountRoutingNumber: string;
    memo: string;
  };
  SWIFT:{
    "instruction_type": string;
    "account_holder_name": string;
    "account_number": string;
    "swift_bic": string;
    "account_holder_address": {
      "address_line1": string;
      "address_line2": string;
      "city": string;
      "state": string;
      "postal_code": string;
      "country_code": string;
    },
    "institution_name": string;
    "institution_address": {
      "address_line1": string;
      "address_line2": string;
      "city": string;
      "state": string;
      "postal_code": string;
      "country_code": string;
    },
    "asset_type_id": string;
    "memo": string;
  };
};
