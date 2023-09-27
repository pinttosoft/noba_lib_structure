import { CountryType } from "../types/country_type";
import { CityType } from "../types/city_type";
import { StateType } from "../types/state_type";

export interface IWorldRepository {
  findStatesByCountryCode(countryId: string): Promise<StateType[]>;

  findCitiesByCountryCodeAndStateId(
    countryCode: string,
    stateId: number,
  ): Promise<CityType[]>;

  findCountries(): Promise<CountryType[]>;
}
