import { User } from "../user";

export interface IUserRepository {
  upsert(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
  findByToken(token: string): Promise<User | undefined>;
}
