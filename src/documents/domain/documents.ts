import { DocumentType } from "./enums/document_type.enum";
import { v4 } from "uuid";
import { DocumentSide } from "./enums/document_side.enum";
import { KycVerification } from "../../client/domain/types/kyc-verification";

export class Documents {
  private documentId: string;
  private patch: string;
  private clientId: string;
  private documentType: DocumentType;
  private documentSide: DocumentSide;
  private kycVerification?: KycVerification;

  static newDocument(
    clientId: string,
    path: string,
    documentType: DocumentType,
    documentSide: DocumentSide,
    kycVerification?: KycVerification,
  ): Documents {
    const d: Documents = new Documents();
    d.clientId = clientId;
    d.patch = path;
    d.documentType = documentType;
    d.documentId = v4();
    d.documentSide = documentSide;
    d.kycVerification = kycVerification;

    return d;
  }

  static updateDocument(
    document: Documents,
    data: {
      patch?: string;
      documentType?: DocumentType;
      documentSide?: DocumentSide;
      kycVerification?: KycVerification;
    },
  ): Documents {
    const d = new Documents();
    d.clientId = document.clientId;
    d.patch = data.patch || document.patch;
    d.documentType = data.documentType || document.documentType;
    d.documentId = document.documentId;
    d.documentSide = data.documentSide || document.documentSide;
    d.kycVerification = data.kycVerification || document.kycVerification;

    return d;
  }

  static fromPrimitives(data: any): Documents {
    const f = new Documents();
    f.clientId = data.clientId;
    f.patch = data.patch;
    f.documentType = data.documentType;
    f.documentId = data.documentId;
    f.documentSide = data.documentSide;
    f.kycVerification = data.kycVerification;

    return f;
  }

  getClientId(): string {
    return this.clientId;
  }

  getDocumentId(): string {
    return this.documentId;
  }

  getKycVerification(): KycVerification | undefined {
    return this.kycVerification;
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
      kycVerification: this.kycVerification,
    };
  }
}
