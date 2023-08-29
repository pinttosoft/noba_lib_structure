import { MongoRepository } from "./MongoRepository";
import { MongoClientFactory } from "./MongoClientFactory";
import { CacheRepository } from "@/shared/domain/interfaces/cache_repository";
import { Cache } from "@/shared/domain/cache";

export class MongoCache
  extends MongoRepository<Cache>
  implements CacheRepository
{
  private static _instance: MongoCache;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new MongoCache();
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

    return Cache.fromPrimitives(
      document._id.toString(),
      document.key,
      document.value,
    );
  }

  async set(cacheObj: Cache): Promise<void> {
    await this.persist(cacheObj.getId(), cacheObj);
  }
}
