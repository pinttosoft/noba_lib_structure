import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { CompanyDTO } from "../../client";
import { Address } from "../../shared";
import { Documents } from "../../documents";

export class CompanyOwner implements IOwnerAccount {
  constructor(private readonly company: CompanyDTO) {}

  getAddress(): Address {
    return this.company.informationCompany.physicalAddress;
  }

  getIdentifyNumber(): string {
    return this.company.informationCompany.registerNumber;
  }

  getEmail(): string {
    return this.company.informationCompany.email;
  }

  getName(): string {
    return this.company.informationCompany.name;
  }

  setDocument(document: Documents) {
    if (this.company.documents && this.company.documents.length > 0) {
      const documents = this.company.documents.filter(
        (doc) =>
          !(
            doc.documentSide == document.getDocumentSide() &&
            doc.documentType === document.getDocumentType()
          ),
      );
      documents.push(document.toPrimitives());

      this.company.documents = documents;
    } else {
      this.company.documents = [document.toPrimitives()];
    }
  }

  toPrimitives(): any {
    return { ...this.company };
  }

  deleteAllDocs(): void {
    this.company.documents = [];
  }
}
