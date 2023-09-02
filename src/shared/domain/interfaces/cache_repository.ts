import { Cache } from "../cache";

export interface CacheRepository {
  set(cacheObj: Cache): Promise<void>;

  get(key: string): Promise<Cache>;
}
