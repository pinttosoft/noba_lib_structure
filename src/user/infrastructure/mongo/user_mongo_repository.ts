import { IUserRepository } from "../../domain/interfaces/user_repository.interface";
import { MongoClientFactory, MongoRepository } from "../../../shared";
import { User } from "../../domain/user";
import { ObjectId } from "mongodb";

export class UserMongoRepository
  extends MongoRepository<User>
  implements IUserRepository
{
  private static _instance: UserMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }
  public static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new UserMongoRepository();
    return this._instance;
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
    if (!user.getId()) {
      await this.persist(user.getId(), user);
      return;
    }

    const primitives = await user.toPrimitives();

    const document = {
      ...primitives,
      id: undefined,
    };

    delete document.password;

    await this.execUpdateOne(user.getId(), document);
  }
}
