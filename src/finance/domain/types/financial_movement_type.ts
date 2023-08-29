import { FinancialMovementStatus, TypeFinancialMovement } from "@/finance";

export type FinancialMovement = {
  id?: string;
  accountId: string;
  referenceId: string;
  amount: number;
  typeFinancialMovement: TypeFinancialMovement;
  detail?: string;
  status: FinancialMovementStatus;
  observation?: any;
  createdAt: Date;
  updatedAt?: Date;
};
