import { DomainException } from "../../shared";

export class TaxIdAlreadyExistIntoOtherOpportunity extends DomainException {
  message = "There is an opportunity already registered with that tax id";
  name = "tax_id_already_exists";
}
