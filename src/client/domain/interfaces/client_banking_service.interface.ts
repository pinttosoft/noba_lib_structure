import { Client } from "../client";
import { ApplicationUpdateType } from "../types/application_update.type";
import { IClient } from "./client.interface";
import { Layer2ApplicationStatusResponseType } from "../../../account";

export interface IClientBankingServiceInterface {
  accountOpening(client: Client): Promise<void>;
  createApplication(client: IClient): Promise<string>;
  retrieveApplication(applicationId: string): Promise<string>;
  getStatusApplication(
    applicationId: string,
  ): Promise<Layer2ApplicationStatusResponseType>;
  updateApplication(
    applicationId: string,
    applicationUpdates: ApplicationUpdateType[],
  ): Promise<string>;
  submitApplication(applicationId: string): Promise<string>;
}
