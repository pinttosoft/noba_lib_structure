import { ResidencyStatus } from "./enums/residency_status";
import { Individual } from "./types/Individual";

export class ClientIndividual {
  constructor(client: Individual, clientId?: string) {
    if (clientId === undefined) {
      clientId =
        client.firstName.substring(0, 1) + client.lastName + client.dni;
    }
  }
  private createIdentify(): string {
    return "";
  }
}
