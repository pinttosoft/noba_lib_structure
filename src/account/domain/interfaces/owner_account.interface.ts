import { Address } from "../../../shared";

export interface IOwnerAccount {
  toPrimitives(): any;
  getAddress(): Address;
  getName(): string;
  getEmail(): string;
  getIdentifyNumber(): string;
}
