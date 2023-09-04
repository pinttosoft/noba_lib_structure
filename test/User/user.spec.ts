import { UserMongoRepository } from "../../src";

describe("User", () => {
  it("Validate", async () => {
    const userRepository = UserMongoRepository.instance();
    const user = await userRepository.findByEmail("angel@gmail.com");
  });
});
