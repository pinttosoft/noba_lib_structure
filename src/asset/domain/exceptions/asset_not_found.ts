import { DomainException } from "../../../shared";

export class AssetNotFound extends DomainException {
  name = "asset_not_found";
  message = "The asset is not registered in the system.";
}
