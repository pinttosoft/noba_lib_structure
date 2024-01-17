export type Address = {
  streetOne: string;
  streetTwo: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  number?: string;
  apartmentNumber?: string;
  isBilling?: boolean;
};

export type ContactInformation = {
  phoneCountry: string;
  phoneNumber: string;
  email: string;
};
