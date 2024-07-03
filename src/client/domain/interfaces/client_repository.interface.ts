import { IClient } from "./client.interface";
import { KycVerification } from "../types/kyc-verification";
import { AccountStatus } from "../../../account";

export interface IClientRepository {
  upsert(client: IClient): Promise<void>;

  findByClientId(clientId: string): Promise<IClient | undefined>;

  findByEmail(email: string): Promise<IClient | undefined>;

  findByIDNumber(idNumber: string): Promise<IClient | undefined>;

  findByDni(dni: string): Promise<IClient | undefined>;

  findAllActiveClients(): Promise<IClient[]>;

  findByAccountId(accountId: string): Promise<IClient>;

  findByKYCProfileId(kycProfileId: string): Promise<IClient | undefined>;

  findByKYCSessionId(kycSessionId: string): Promise<IClient | undefined>;

  findByKYCReferenceId(kycReferenceId: string): Promise<IClient | undefined>;

  findByPartnerKYCSessionId(
    partnerKYCSessionId: string,
  ): Promise<IClient | undefined>;

  findByPartnerKYCProfileId(
    partnerKYCProfileId: string,
  ): Promise<IClient | undefined>;

  setKycVerification(
    client: IClient,
    kycVerification: KycVerification,
  ): Promise<void>;

  setKycVerificationPartner(
    client: IClient,
    dni: string,
    kycVerification: KycVerification,
  ): Promise<void>;

  setStatus(client: IClient, status: AccountStatus): Promise<void>;
}
