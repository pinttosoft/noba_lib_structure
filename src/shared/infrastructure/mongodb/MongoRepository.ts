import { Collection, MongoClient, ObjectId } from "mongodb";
import { Criteria } from "../domain/specification";
import { MongoCriteriaConverter, MongoQuery } from "./MongoCriteriaConverter";
import { AggregateRoot } from "../domain/AggregateRoot";
import { Paginate } from "../domain/type/Paginate";

export abstract class MongoRepository<T extends AggregateRoot> {
  private criteriaConverter: MongoCriteriaConverter;
  private query: MongoQuery;
  private criteria: Criteria;

  constructor(private _client: Promise<MongoClient>) {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  abstract collectionName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.collectionName());
  }

  // todo return types
  protected async persist(id: string, aggregateRoot: T): Promise<any | void> {
    const collection = await this.collection();

    if (!id) {
      const document = {
        ...aggregateRoot.toPrimitives(),
        id: undefined,
      };

      return await collection.insertOne(document);
    }

    const document = {
      ...aggregateRoot.toPrimitives(),
      id: undefined,
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: document },
      { upsert: true },
    );
  }

  protected async searchByCriteria<D>(criteria: Criteria): Promise<D[]> {
    this.criteria = criteria;
    this.query = this.criteriaConverter.convert(criteria);

    const collection = await this.collection();
    return await collection
      .find<D>(this.query.filter, {})
      .sort(this.query.sort)
      .skip(this.query.skip)
      .limit(this.query.limit)
      .toArray();
  }

  transformationToUpsertInSubDocuments(
    subDocumentField: string,
    primitiveData: any,
  ): {} {
    const response = {};

    for (const key in primitiveData) {
      response[`${subDocumentField}.$.${key}`] = primitiveData[key];
    }

    return response;
  }

  public async buildPaginate<T>(documents: T[]): Promise<Paginate<T>> {
    const collection = await this.collection();

    const count = await collection.countDocuments(this.query.filter);

    const hasNextPage: boolean = this.query.skip * this.criteria.limit < count;

    if (documents.length === 0) {
      return {
        nextPag: null,
        prevPag: null,
        count: 0,
        results: [],
      };
    }

    return {
      nextPag: hasNextPage ? Number(this.query.skip) + 2 : null,
      prevPag: null,
      count: count,
      results: documents,
    };
  }
}
