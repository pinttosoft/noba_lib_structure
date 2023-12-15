import { CountryType, WorldMongoRepository } from "../../src";

describe("World", () => {
  it("Add country", async () => {
    //
    const worldRepository = WorldMongoRepository.instance();

    const estoniaPayload: CountryType = {
      calling_code: "+372",
      country_code: "EE",
      country_id: "EST",
      name: "ESTONIA",
    };

    // await worldRepository.addCountry(estoniaPayload);

    const countries = await worldRepository.findCountries();

    console.log("countries length", countries.length);

    const estonia = countries.find((country) => country.country_code === "EE");
    console.log("ESTONIA", estonia);
  });

  it("Edit country", async () => {
    //
    const worldRepository = WorldMongoRepository.instance();

    const estoniaPayload: CountryType = {
      calling_code: "+372",
      country_code: "EE",
      country_id: "EST",
      name: "Estonia",
    };

    await worldRepository.editCountry(
      estoniaPayload.country_code,
      estoniaPayload,
    );

    const countries = await worldRepository.findCountries();

    console.log("countries length", countries.length);

    const estonia = countries.find((country) => country.country_code === "EE");
    console.log("ESTONIA", estonia);
  });
});
