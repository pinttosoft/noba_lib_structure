import { Account } from "./account";
import { IOwnerAccount } from "./interfaces/owner_account.interface";
import { Individual } from "../../client/domain/types/Individual";

export class CompanyAccount extends Account {
  private members: Individual[];

  getOwnerAccount(): IOwnerAccount {
    return undefined;
  }
}
