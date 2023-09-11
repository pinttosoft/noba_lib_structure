import { DomainException } from "../../shared";

export class OpportunityDoesNotExists extends DomainException {
  message = "The opportunity does not exists";
  name = "the_opportunity_does not_exists";
}
