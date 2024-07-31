import { CrmMarketingContact } from "../types/crm_marketing_contact.type";

export interface ICrmMarketingService {
  createContact(contact: CrmMarketingContact): Promise<{
    id: string;
  }>;

  getContactByEmail(email: string): Promise<CrmMarketingContact>;

  addContactToList(contactId: number, listId: number): Promise<void>;

  getOrCreateContactByEmail(
    email: string,
    contact?: CrmMarketingContact,
  ): Promise<{ id: string }>;

  addNewContactToList(
    contact: CrmMarketingContact,
    listId: number,
  ): Promise<{
    id: string;
  }>;

  updateContactByEmail(
    email: string,
    contact: CrmMarketingContact,
  ): Promise<{
    id: string;
  }>;

  removeContactFromList(contactId: number, listId: number): Promise<void>;

  transferContactBetweenListsByEmail(
    email: string,
    fromListId: number,
    toListId: number,
  ): Promise<void>;

  removeContactFromListByEmail(email: string, listId: number): Promise<void>;
}
