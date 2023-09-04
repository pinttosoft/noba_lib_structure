import { PasswordValueObject, User, UserMongoRepository } from "../../src";
import * as console from "console";

describe("User", () => {
  it("Create new user", async () => {
    const user: User = User.createNewUser(
      "angel@angel.com",
      PasswordValueObject.instance("12345678"),
      "BRL",
    );

    const repository = new UserMongoRepository();

    await repository.upsert(user);
  });

  it("Validate", async () => {
    const userRepository = UserMongoRepository.instance();
    const user = await userRepository.findByEmail("angel@angel.com");
  });
});
