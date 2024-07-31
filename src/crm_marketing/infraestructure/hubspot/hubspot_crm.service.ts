import { Client } from "@hubspot/api-client";
import { ICrmMarketingService } from "../../domain/interfaces/crm_marketing_service.interface";
import { CrmMarketingContact } from "../../domain/types/crm_marketing_contact.type";

export class HubspotClientService implements ICrmMarketingService {
  private static _instance: HubspotClientService;
  private readonly API_KEY = process.env.HUBSPOT_API_KEY;
  private hubspotClient: Client;

  constructor() {
    this.hubspotClient = new Client({
      accessToken: this.API_KEY,
    });
  }

  static instance(): HubspotClientService {
    if (!this._instance) {
      HubspotClientService._instance = new HubspotClientService();
    }

    return HubspotClientService._instance;
  }

  async createContact(contact: CrmMarketingContact): Promise<{ id: string }> {
    const contactData = {
      properties: {
        email: contact.email,
        firstname: contact.name,
        lastname: contact.lastName,
        phone: contact.phone,
      },
      associations: [],
    };

    const result = await this.hubspotClient.crm.contacts.basicApi.create({
      ...contactData,
    });

    return { id: result.id };
  }

  async addNewContactToList(
    contact: CrmMarketingContact,
    listId: number,
  ): Promise<{ id: string }> {
    const contactData = {
      properties: {
        email: contact.email,
        firstname: contact.name,
        lastname: contact.lastName,
        phone: contact.phone,
      },
      associations: [],
    };

    const contactAPResult = await this.getOrCreateContactByEmail(
      contact.email,
      contact,
    );

    await this.addContactToList(Number(contactAPResult.id), listId);

    return { id: contactAPResult.id };
  }

  async getContactByEmail(email: string): Promise<CrmMarketingContact> {
    try {
      const apiResponse =
        await this.hubspotClient.crm.contacts.basicApi.getById(
          email,
          ["firstname", "lastname", "email", "phone"],
          undefined,
          undefined,
          undefined,
          "email",
        );

      if (!apiResponse) {
        return null;
      }

      return {
        id: apiResponse.id,
        name: apiResponse.properties.firstname,
        lastName: apiResponse.properties.lastname,
        email: apiResponse.properties.email,
        phone: apiResponse.properties.phone,
      };
    } catch (e) {
      return null;
    }
  }

  async addContactToList(contactId: number, listId: number): Promise<void> {
    await this.hubspotClient.crm.lists.membershipsApi.addAndRemove(listId, {
      recordIdsToAdd: [contactId],
      recordIdsToRemove: [],
    });
  }

  async removeContactFromList(
    contactId: number,
    listId: number,
  ): Promise<void> {
    await this.hubspotClient.crm.lists.membershipsApi.addAndRemove(listId, {
      recordIdsToAdd: [],
      recordIdsToRemove: [contactId],
    });
  }

  async transferContactBetweenListsByEmail(
    email: string,
    fromListId: number,
    toListId: number,
  ) {
    const contact = await this.getContactByEmail(email);
    await this.removeContactFromList(Number(contact.id), Number(fromListId));
    await this.addContactToList(Number(contact.id), Number(toListId));
  }

  async updateContactByEmail(
    email: string,
    contact: CrmMarketingContact,
  ): Promise<{
    id: string;
  }> {
    const contactData = {
      properties: {
        email: contact.email,
        firstname: contact.name,
        lastname: contact.lastName,
        phone: contact.phone,
      },
    };
    let contactAPResult: { id: string } = await this.getOrCreateContactByEmail(
      email,
      {
        ...contact,
      },
    );

    await this.hubspotClient.crm.contacts.basicApi.update(contactAPResult.id, {
      ...contactData,
    });

    return { id: contactAPResult.id };
  }

  async getOrCreateContactByEmail(
    email: string,
    contact?: CrmMarketingContact,
  ): Promise<{ id: string }> {
    const contactAPResult = await this.getContactByEmail(email);

    if (!contactAPResult) {
      return await this.createContact(contact);
    }

    return { id: contactAPResult.id };
  }

  async removeContactFromListByEmail(
    email: string,
    listId: number,
  ): Promise<void> {
    const contact = await this.getOrCreateContactByEmail(email, {
      email,
      name: "",
      lastName: "",
      phone: "",
    });

    await this.removeContactFromList(Number(contact.id), listId);
  }
}
