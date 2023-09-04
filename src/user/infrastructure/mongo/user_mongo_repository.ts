import { IUserRepository } from "../../domain/interfaces/user_repository.interface";
import { MongoClientFactory, MongoRepository } from "../../../shared";
import { User } from "../../domain/user";

export class UserMongoRepository
  extends MongoRepository<User>
  implements IUserRepository
{
  constructor() {
    super(MongoClientFactory.createClient());
  }

  collectionName(): string {
    return "user_app";
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ email });
    if (!result) {
      return undefined;
    }

    return User.fromPrimitives(result._id.toString(), { ...result });
  }

  async findByToken(token: string): Promise<User | undefined> {
    const collection = await this.collection();
    const result = await collection.findOne({ token });
    if (!result) {
      return undefined;
    }

    return User.fromPrimitives(result._id.toString(), { ...result });
  }

  async upsert(user: User): Promise<void> {
    await this.persist(user.getId(), user);
  }
}
