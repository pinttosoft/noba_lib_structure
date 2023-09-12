import {
  checkPassword,
  PasswordValueObject,
  User,
  UserMongoRepository,
} from "../../src";
import { v4 } from "uuid";

describe("App user", () => {
  it("create new user and validate password", async () => {
    const planPassword: string = "123@Ngel";
    const passwordValueObject = PasswordValueObject.fromPrimitive(planPassword);

    const user: User = User.fromPrimitives(v4(), {
      email: "programador.angel@gmail.com",
      password: await passwordValueObject.getValueEncrypt(),
      country: "BR",
    });

    expect(await checkPassword(planPassword, user.getPassword())).toBeTruthy();

    // const planPassword: string = "123@Ngel";
    // const passwordValueObject = PasswordValueObject.fromPrimitive(planPassword);
    //
    // let user: User = User.createNewUser(
    //     "programador.angel@gmail.com",
    //     passwordValueObject,
    //     "BR",
    // );
    // await UserMongoRepository.instance().upsert(user);
    //
    // user = await UserMongoRepository.instance().findByEmail(
    //     "programador.angel@gmail.com",
    // );
    // expect(await checkPassword(planPassword, user.getPassword())).toBeTruthy();
  });
});
