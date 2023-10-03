import { IClientRepository } from "../domain/interfaces/client_repository.interface";
import { IClient } from "../domain/interfaces/client.interface";
import { ClientNotFound } from "../domain/exceptions/client_not_found";
import { logger } from "../../index";

export class FindByClientId {
  constructor(private readonly clientRepository: IClientRepository) {}

  async run(clientId: string): Promise<IClient> {
    logger.info(`Buscando cliente ${clientId}`);
    const client: IClient =
      await this.clientRepository.findByClientId(clientId);

    if (!client) {
      logger.info(`Cliente no encontrado ${clientId}`);
      throw new ClientNotFound();
    }

    return client;
  }
}
