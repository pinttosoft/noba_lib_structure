import {
  ContactValidationType,
  ContactValidationUserMongoRepository,
  StringValueObject,
  UserMongoRepository,
  ValidateUserContact
} from "../../src";

describe("Contact Validation User", () => {
  it("Create Contact Validation User type: phone", async () => {
    //
    const userRepository = UserMongoRepository.instance();
    const contactValidationUserMongoRepository = ContactValidationUserMongoRepository.instance();
    const user = await userRepository.findByEmail("noba@noba.com");

    const userIdValue = StringValueObject.create(user.getId());


    const validate = ValidateUserContact.generateCodeForValidation(
      userIdValue.value,
      ContactValidationType.VALIDATE_EMAIL
    );

    const existsPhoneCode = await contactValidationUserMongoRepository.findByTypeAndUserId(ContactValidationType.VALIDATE_PHONE, userIdValue.value)


    console.log('existsPhoneCode', existsPhoneCode)

    await contactValidationUserMongoRepository.upsert(validate)

    // expect().not.toBe(undefined)
  })
})