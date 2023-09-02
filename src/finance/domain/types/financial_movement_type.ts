import { TypeFinancialMovement } from "../enums/type_financial_movement.enum";
import { FinancialMovementStatus } from "../enums/financial_movement_status.enum";

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
