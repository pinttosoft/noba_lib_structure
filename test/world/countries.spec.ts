import { CountryType, WorldMongoRepository } from "../../src";

describe("Country", () => {
  it("Get all countries", async () => {
    //

    const countries = await WorldMongoRepository.instance().findCountries();
    console.log("countries", countries);
  });

  it("Save Wakanda country", async () => {
    const wakanda: CountryType = {
      country_id: "wak1",
      country_code: "wak",
      name: "Wakanda",
      calling_code: "1",
    };

    await WorldMongoRepository.instance().createCountry(wakanda);
    console.log("wakanda is saved");

    const wakandaEdited = {
      country_id: "wak1",
      country_code: "Wakanda forever",
      name: "Wakanda tchala",
      calling_code: "11111111111111111111",
    };
    await WorldMongoRepository.instance().editCountry(wakandaEdited);
    console.log("wakanda is edited!");

    await WorldMongoRepository.instance().deleteCountry(wakanda.country_id);
    console.log("wakanda is deleted!");
  });
});
