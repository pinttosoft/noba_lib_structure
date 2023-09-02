import { IntermediaryNumberType } from "../enums/intermediary_number_type.enum";

export type IntermediaryBankDTO = {
  swiftCode: string;
  nameBank: string;
  intermediaryBankName: string;
  intermediaryNumber: string;
  intermediaryNumberType: IntermediaryNumberType;

  intermediaryBankStreetOne: string;
  intermediaryBankStreetTwo?: string;
  intermediaryBankPostalCode?: string;
  intermediaryBankCity: string;
  intermediaryBankCountry: string;
  intermediaryBankState?: string;

  bankStreetOne: string;
  bankStreetTwo?: string;
  bankPostalCode?: string;
  bankCity: string;
  bankCountry: string;
  bankState?: string;
};
