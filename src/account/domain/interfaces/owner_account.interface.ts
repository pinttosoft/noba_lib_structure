import { Address } from "../../../shared";
import { Documents } from "../../../documents";
import { KycAction } from "../../../client";

export interface IOwnerAccount {
  toPrimitives(): any;
  getAddress(): Address;
  getName(): string;
  getEmail(): string;
  getIdentifyNumber(): string;
  setDocument(document: Documents): void;
}
