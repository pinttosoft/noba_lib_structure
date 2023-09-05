import { CounterpartyType } from "../enums/counterparty_type.enum";
import { IAccount } from "../../../account";
import { Address } from "../../../shared";

export type CounterpartyForWithdrawalType = {
  account: IAccount;
  realName: string;
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  swiftCode?: string;
  bankAddress: Address;

  counterpartyType: CounterpartyType;
  iban?: string;
};
