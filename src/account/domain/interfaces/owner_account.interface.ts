import { Address } from "../../../shared";
import { Documents } from "../../../documents";

export interface IOwnerAccount {
  toPrimitives(): any;
  getAddress(): Address;
  getName(): string;
  getEmail(): string;
  getIdentifyNumber(): string;
  setDocument(document: Documents): void;
  deleteAllDocs(): void;
}
