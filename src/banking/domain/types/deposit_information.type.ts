import { NetworkBank } from "../enums/network_bank.enum";
import { DepositStatus } from "../enums/deposit_status.enum";

export type DepositInformation = {
  date: Date;
  instructionDepositId: string;
  depositId: string;
  countryCode: string;
  status: DepositStatus;
  networkBank: NetworkBank;
  amount: number;
};
