import { checkPassword, PasswordValueObject } from "../../src";

describe("Helpers hash", () => {
  it("encrypt and descrypt password ", async () => {
    const planPassword: string = "123@Ngel";
    const hashPassword: string =
      await PasswordValueObject.fromPrimitive(planPassword).getValueEncrypt();

    expect(await checkPassword(planPassword, hashPassword)).toBeTruthy();
  });
});
