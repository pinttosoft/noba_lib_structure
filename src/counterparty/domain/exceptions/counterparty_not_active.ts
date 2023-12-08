import {DomainException} from "../../../shared";

export class CounterpartyNotActive extends DomainException {
    name = "counterparty_not_active"
    message = "The counterparty is not yet active"
}