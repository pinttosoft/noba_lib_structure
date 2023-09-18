import { AggregateRoot } from "../../shared/domain/aggregate_root";
import { DocumentType } from "./enums/document_type.enum";

export class Document extends AggregateRoot {
  private id?: string;
  private patch: string;
  private clientId: string;
  private documentType: DocumentType;

  getId(): string {
    return this.id;
  }

  toPrimitives(): any {
    return {};
  }
}
