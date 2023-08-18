import { Account } from "./account";
import { Individual } from "../../client/domain/types/Individual";

export class IndividualAccount extends Account {
  toJson(): any {
    const owner: Individual = this.owner.toJson() as Individual;

    return { owner: owner };
  }
}
