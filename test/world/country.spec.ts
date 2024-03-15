import { WorldMongoRepository } from "../../src";
import { Country } from "../../src/world/domain/country";

describe("Country", () => {
  process.env.MONGO_PASS = "zrfhowt0cguf";
  process.env.MONGO_USER = "noab-dev-mongodb";
  process.env.MONGO_DB = "dbnobadev";
  process.env.MONGO_SERVER = "cluster0.xdwtnb4.mongodb.net";

  it("Create Country", async () => {
    //
    const countryPayload: any = {
      country_id: "countryPayload.countryId",
      name: "countryPayload.name",
      country_code: "countryPayload.countryCode",
      calling_code: "countryPayload.callingCodecountryPayload.callingCode",
    };
    const countryRepo = WorldMongoRepository.instance();
    const country = new Country().fromPrimitives(countryPayload);
    await countryRepo.upsert(country);
  });
});
