import { ContactValidationType } from "../enums/contact_validation_type";
import { ValidateUserContact } from "../validate_user_contact";

export interface IContactValidationUser {
  findByTypeAndUserId(
    typeValidation: ContactValidationType,
    userId: string,
  ): Promise<ValidateUserContact | undefined>;

  upsert(contactValidation: ValidateUserContact): Promise<void>;
}
