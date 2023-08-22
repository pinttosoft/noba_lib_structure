import { Cache } from "@/shared/domain/cache";

export interface CacheRepository {
  set(cacheObj: Cache): Promise<void>;

  get(key: string): Promise<Cache>;
}
