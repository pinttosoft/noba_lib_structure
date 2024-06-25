import { DomainException } from "../../shared";

export class TaxIdAlreadyExistIntoOtherReferred extends DomainException {
  message = "There is a referred already registered with that tax id";
  name = "tax_id_already_exists";
}
