import { DepositStatus } from "../../../banking";

export type InternalDepositInformation = {
  date: Date;
  instructionDepositId: string;
  depositId: string;
  amount: number;
  status: DepositStatus;
};
