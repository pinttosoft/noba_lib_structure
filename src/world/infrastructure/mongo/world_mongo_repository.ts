import { MongoClientFactory, MongoRepository } from "../../../shared";
import { IWorldRepository } from "../../domain/interfaces/world_repository";
import { CityType } from "../../domain/types/city_type";
import { CountryType } from "../../domain/types/country_type";
import { StateType } from "../../domain/types/state_type";

export class WorldMongoRepository
  extends MongoRepository<any>
  implements IWorldRepository
{
  private static _instance: WorldMongoRepository;
  private collectName: string = "";

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new WorldMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return this.collectName;
  }

  async findCitiesByCountryCodeAndStateId(
    countryCode: string,
    stateId: number,
  ): Promise<CityType[]> {
    this.collectName = "cities";
    const collection = await this.collection();

    return await collection
      .find<CityType>({ country_id: countryCode, state_id: stateId })
      .sort("name", -1)
      .toArray();
  }

  async findCountries(): Promise<CountryType[]> {
    this.collectName = "countries";
    const collection = await this.collection();

    return await collection.find<CountryType>({}).sort("name", -1).toArray();
  }

  async findStatesByCountryCode(countryId: string): Promise<StateType[]> {
    this.collectName = "states";
    const collection = await this.collection();

    return await collection
      .find<StateType>({ country_id: countryId })
      .sort("name", -1)
      .toArray();
  }

  async createCountry(country: CountryType): Promise<void> {
    this.collectName = "countries";
    const collection = await this.collection();

    await collection.insertOne(country);
  }

  async deleteCountry(countryId: string): Promise<void> {
    this.collectName = "countries";
    const collection = await this.collection();

    await collection.deleteOne({ country_id: countryId });
  }

  async editCountry(updatedCountry: CountryType): Promise<void> {
    this.collectName = "countries";
    const collection = await this.collection();

    await collection.updateOne(
      { country_id: updatedCountry.country_id },
      { $set: updatedCountry },
    );
  }
}
