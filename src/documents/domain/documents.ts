import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { DocumentType } from "./enums/document_type.enum";
import { v4 } from "uuid";
import { DocumentSide } from "./enums/document_side.enum";

export class Documents {
  private documentId: string;
  private patch: string;
  private clientId: string;
  private documentType: DocumentType;
  private documentSide: DocumentSide;

  static newDocument(
    clientId: string,
    path: string,
    documentType: DocumentType,
    documentSide: DocumentSide,
  ): Documents {
    const d: Documents = new Documents();
    d.clientId = clientId;
    d.patch = path;
    d.documentType = documentType;
    d.documentId = v4();
    d.documentSide = documentSide;

    return d;
  }

  static fromPrimitives(data: any): Documents {
    const f = new Documents();
    f.clientId = data.clientId;
    f.patch = data.patch;
    f.documentType = data.documentType;
    f.documentId = data.documentId;
    f.documentSide = data.documentSide;

    return f;
  }

  getClientId(): string {
    return this.clientId;
  }

  getDocumentId(): string {
    return this.documentId;
  }

  getPathFile(): string {
    return this.patch;
  }

  getDocumentType(): DocumentType {
    return this.documentType;
  }

  getDocumentSide(): DocumentSide {
    return this.documentSide;
  }

  toPrimitives(): any {
    return {
      documentId: this.documentId,
      patch: this.patch,
      documentType: this.documentType,
      documentSide: this.documentSide,
    };
  }
}
