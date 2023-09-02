import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { FinancialMovement } from "./types/financial_movement_type";
import { FinancialMovementStatus } from "./enums/financial_movement_status.enum";

export class Finance extends AggregateRoot {
  constructor(private readonly financialMovement: FinancialMovement) {
    if (financialMovement.id) {
      financialMovement.updatedAt = new Date();
    }
    super();
  }

  getId(): string {
    return this.financialMovement.id;
  }

  setStatus(status: FinancialMovementStatus) {
    this.financialMovement.status = status;
  }

  setObservation(obs: any) {
    this.financialMovement.observation = obs;
  }

  toPrimitives(): FinancialMovement {
    return this.financialMovement;
  }
}
