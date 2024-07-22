import { ReferredStatus } from "../enums/referred_status.enum";
import { AccountStatus, AccountType } from "../../account";

export type ReferredDTO = {
  id?: string;
  taxId: string;
  name: string;
  email: string;
  feeSwap: number; // es lo que es aliado se gana por cada exchange
  status: ReferredStatus;
  referredByClientId: string;
  type: AccountType;
  clientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  accountStatus?: AccountStatus;
  birthdate?: Date;
  phoneNumber?: string;
  address?: string;
};
