import { AggregateRoot } from "../../shared/domain/aggregate_root";

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
