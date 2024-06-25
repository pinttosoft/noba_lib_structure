import { DomainException } from "../../shared";

export class ReferredDoesNotExists extends DomainException {
  message = "The referred does not exists";
  name = "the_referred_does not_exists";
}
