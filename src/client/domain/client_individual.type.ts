import { ResidencyStatus } from "./enums/residency_status";
import { Individual } from "./types/Individual";
import { Client } from "@/client/domain/abtracts/client.abstract";
import { ClientType } from "aws-sdk/clients/ssooidc";
import { AccountType } from "@/account/domain/enums/account_type";

export class ClientIndividual extends Client {
  constructor(client: Individual, clientId?: string) {
    super(client, AccountType.INDIVIDUAL, clientId);
  }
  toJson(): any {
    return { ...this.clientData, clientId: this.clientId };
  }
}
