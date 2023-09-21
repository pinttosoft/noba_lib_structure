import { DomainException } from "../../../shared";

export class WalletNotFound extends DomainException {
  name = "wallet_not_found";
  message = "Wallet not found";
}
