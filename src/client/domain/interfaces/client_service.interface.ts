import { Client } from "../client";
import { ApplicationUpdateType } from "../types/application_update.type";

export interface IClientServiceInterface {
  accountOpening(client: Client): Promise<void>;
  createApplication(client: Client): Promise<string>;
  retrieveApplication(applicationId: string): Promise<string>;
  statusApplication(applicationId: string): Promise<string>;
  updateApplication(
    applicationId: string,
    applicationUpdates: ApplicationUpdateType[],
  ): Promise<string>;
  submitApplication(applicationId: string): Promise<string>;
}
