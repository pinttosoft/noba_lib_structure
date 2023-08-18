import { MongoClient } from "mongodb";

export class MongoClientFactory {
  private static clients: { [key: string]: MongoClient } = {};

  static async createClient(): Promise<MongoClient> {
    let client = MongoClientFactory.getClient();

    if (!client) {
      client = await MongoClientFactory.createAndConnectClient();

      MongoClientFactory.registerClient(client);
    }

    return client;
  }

  private static getClient(): MongoClient | null {
    return MongoClientFactory.clients["default"];
  }

  private static async createAndConnectClient(): Promise<MongoClient> {
    let MONGO_PASS =
      process.env.NODE_ENV === "prod" ? process.env.MONGO_PASS : "zrfhowt0cguf";
    let MONGO_USER =
      process.env.NODE_ENV === "prod"
        ? process.env.MONGO_USER
        : "noab-dev-mongodb";
    let MONGO_DB =
      process.env.NODE_ENV === "prod" ? process.env.MONGO_DB : "dbnobadev";
    let MONGO_SERVER =
      process.env.NODE_ENV === "prod"
        ? process.env.MONGO_SERVER
        : "cluster0.xdwtnb4.mongodb.net";

    const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}/${MONGO_DB}?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { ignoreUndefined: true });

    await client.connect();

    return client;
  }

  private static registerClient(client: MongoClient): void {
    MongoClientFactory.clients["default"] = client;
  }
}
