import { Cache } from "./Cache";

export interface CacheRepository {
  set(cacheObj: Cache): Promise<void>;

  get(key: string): Promise<Cache>;
}
