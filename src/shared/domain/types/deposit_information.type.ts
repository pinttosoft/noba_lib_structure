import { DepositStatus, NetworkBank } from "../../../banking";

export type DepositInformation = {
  date: Date;
  instructionDepositId: string;
  depositId: string;
  status: DepositStatus;
  networkBank?: NetworkBank;
  amount: number;
};
