import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IClient } from "../../domain/interfaces/client.interface";
import { IClientRepository } from "../../domain/interfaces/client_repository.interface";
import {
  AccountMongoRepository,
  AccountNotFound,
  AccountStatus,
  IAccount,
} from "../../../account";
import { ClientFactory } from "../../domain/factories/client.factory";
import { KycVerification } from "../../domain/types/kyc-verification";

export class ClientMongoRepository
  extends MongoRepository<IClient>
  implements IClientRepository
{
  private static _instance: ClientMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public static instance(): ClientMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ClientMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "clients";
  }

  async findByEmail(email: string): Promise<IClient> {
    const collection = await this.collection();

    const result = await collection.findOne<any>({ email });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByClientId(clientId: string): Promise<IClient | undefined> {
    const collection = await this.collection();

    const result = await collection.findOne<any>({ clientId });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByAccountId(accountId: string): Promise<IClient> {
    const collection = await this.collection();

    const result = await collection.findOne<any>({ accountId });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async upsert(client: IClient): Promise<void> {
    await this.persist(client.getId(), client);
  }

  async findByIDNumber(idNumber: string): Promise<IClient> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ idNumber });
    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findAllActiveClients(): Promise<IClient[]> {
    const collection = await this.collection();
    const result = await collection
      .find<any>({ status: AccountStatus.APPROVED })
      .toArray();

    return await Promise.all(
      result.map((client) =>
        this.buildClient({ ...client }, client._id.toString()),
      ),
    );
  }

  async findByDni(dni: string): Promise<IClient | undefined> {
    const collection = await this.collection();
    let result = await collection.findOne<any>({ dni });

    if (!result) {
      result = await collection.findOne<any>({
        "informationCompany.registerNumber": dni,
      });
    }

    if (!result) return undefined;

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByKYCProfileId(kycProfileId: string): Promise<IClient | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "kycVerification.profileId": kycProfileId,
    });

    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByKYCReferenceId(
    kycReferenceId: string,
  ): Promise<IClient | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "kycVerification.reference": kycReferenceId,
    });

    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByKYCSessionId(kycSessionId: string): Promise<IClient | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "kycVerification.sessionId": kycSessionId,
    });

    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByPartnerKYCProfileId(
    partnerKYCProfileId: string,
  ): Promise<IClient | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "partners.kycVerification.profileId": partnerKYCProfileId,
    });

    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async findByPartnerKYCSessionId(
    partnerKYCSessionId: string,
  ): Promise<IClient | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({
      "partners.kycVerification.sessionId": partnerKYCSessionId,
    });

    if (!result) {
      return undefined;
    }

    return this.buildClient({ ...result }, result._id.toString());
  }

  async setKycVerification(
    client: IClient,
    kycVerification: KycVerification,
  ): Promise<void> {
    const collection = await this.collection();
    await collection.updateOne(
      { clientId: client.getClientId() },
      { $set: { kycVerification } },
    );
  }

  async setKycVerificationPartner(
    client: IClient,
    dni: string,
    kycVerification: KycVerification,
  ): Promise<void> {
    const collection = await this.collection();

    await collection.updateOne(
      {
        clientId: client.getClientId(),
        "partners.dni": dni,
      },
      { $set: { "partners.$.kycVerification": kycVerification } },
    );
  }

  async setStatus(client: IClient, status: AccountStatus) {
    const collection = await this.collection();
    await collection.updateOne(
      { clientId: client.getClientId() },
      { $set: { status } },
    );
  }

  private async buildClient(client: any, resultId: string): Promise<IClient> {
    const account: IAccount =
      await new AccountMongoRepository().findByAccountId(client.accountId);

    if (!account) {
      throw new AccountNotFound(client.accountId);
    }

    return ClientFactory.fromPrimitives(resultId, client, account);
  }
}
