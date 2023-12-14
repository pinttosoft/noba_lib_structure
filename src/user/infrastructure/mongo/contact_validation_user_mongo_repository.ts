import { MongoClientFactory, MongoRepository } from "../../../shared";
import { ValidateUserContact } from "../../domain/validate_user_contact";
import { IContactValidationUserRepository } from "../../domain/interfaces/contact_validation_user.interface_repository";
import { ContactValidationType } from "../../domain/enums/contact_validation_type";

export class ContactValidationUserMongoRepository
  extends MongoRepository<ValidateUserContact>
  implements IContactValidationUserRepository
{
  private static _instance: ContactValidationUserMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public static instance(): ContactValidationUserMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ContactValidationUserMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "contact_validate_user";
  }

  async findByTypeAndUserId(
    typeValidation: ContactValidationType,
    userId: string,
  ): Promise<ValidateUserContact | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({
      type: typeValidation,
      userId: userId,
    });

    if (!result) {
      return undefined;
    }

    return ValidateUserContact.fromPrimitives(result._id.toString(), {
      ...result,
    });
  }

  async upsert(contactValidation: ValidateUserContact): Promise<void> {
    await this.persist(contactValidation.getId(), contactValidation);
  }

  async deleteByUserIdAndValidationType(
    userId: string,
    validationType: ContactValidationType,
  ): Promise<void> {
    const collection = await this.collection();
    await collection.deleteMany({ userId: userId, type: validationType });
  }
}
