import { Client } from "../client";
import { ApplicationUpdateType } from "../types/application_update.type";
import { IClient } from "./client.interface";

export interface IClientBankingServiceInterface {
  accountOpening(client: Client): Promise<void>;
  createApplication(client: IClient): Promise<string>;
  retrieveApplication(applicationId: string): Promise<string>;
  statusApplication(applicationId: string): Promise<string>;
  updateApplication(
    applicationId: string,
    applicationUpdates: ApplicationUpdateType[],
  ): Promise<string>;
  submitApplication(applicationId: string): Promise<string>;
}
