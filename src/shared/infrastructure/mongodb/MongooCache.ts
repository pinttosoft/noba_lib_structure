import { CacheRepository } from "../../domain/CacheRepository";
import { MongoRepository } from "./MongoRepository";
import { MongoClientFactory } from "./MongoClientFactory";
import { Cache } from "../../domain/Cache";

export class MongooCache
  extends MongoRepository<Cache>
  implements CacheRepository
{
  private static _instance: MongooCache;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new MongooCache();
    return this._instance;
  }

  collectionName(): string {
    return "caches";
  }
  async get(key: string): Promise<Cache> {
    const collection = await this.collection();

    const document = await collection.findOne({ key });

    if (!document) {
      return undefined;
    }

    return Cache.formPrimitives(
      document._id.toString(),
      document.key,
      document.value,
    );
  }

  async set(cacheObj: Cache): Promise<void> {
    await this.persist(cacheObj.getId(), cacheObj);
  }
}
