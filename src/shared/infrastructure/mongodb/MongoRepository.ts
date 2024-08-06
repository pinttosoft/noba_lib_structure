import { Collection, MongoClient, ObjectId } from "mongodb";
import { Criteria } from "../../domain/criteria";
import { MongoCriteriaConverter, MongoQuery } from "./MongoCriteriaConverter";
import { Paginate } from "../../domain/types/paginate";
import { AggregateRoot } from "../../domain/aggregate_root";

export abstract class MongoRepository<T extends AggregateRoot> {
  private criteriaConverter: MongoCriteriaConverter;
  private query: MongoQuery;
  private criteria: Criteria;

  constructor(private _client: Promise<MongoClient>) {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  abstract collectionName(): string;

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

    return this.createObjectPaginate<T>(documents, count);
  }

  protected async buildPaginatedArrayField<T>(
    filter: object,
    documents: T[],
    arrayFieldName: string,
  ): Promise<Paginate<T>> {
    const collection = await this.collection();
    const result = await collection
      .find(filter)
      .project({
        totalRecords: { $size: `$${arrayFieldName}` },
      })
      .toArray();
    let count = 0;

    if (result.length > 0) {
      count = result[0].totalRecords;
    }

    console.log("totalRecords", count);

    return this.createObjectPaginate<T>(documents, count);
  }

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection<T>(): Promise<Collection<T>> {
    return (await this._client).db().collection<T>(this.collectionName());
  }

  // todo return types
  protected async persist(id: string, aggregateRoot: T): Promise<ObjectId> {
    let primitives: any;

    if (aggregateRoot.toPrimitives() instanceof Promise) {
      primitives = await aggregateRoot.toPrimitives();
    } else {
      primitives = aggregateRoot.toPrimitives();
    }

    return await this.execUpdateOne(id, {
      ...primitives,
    });
  }

  protected async execUpdateOne(id: string, document: any): Promise<ObjectId> {
    const collection = await this.collection();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: document },
      { upsert: true },
    );

    return result.upsertedId;
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

  protected async paginateAggregation<D>(
    criteria: Criteria,
    pipelines?: any[],
  ): Promise<Paginate<D>> {
    this.criteria = criteria;
    const finalPipelines = [];

    this.query = this.criteriaConverter.convert(criteria);
    const collection = await this.collection();

    const skip = (this.criteria.currentPage - 1) * this.query.limit;

    if (this.query.filter) {
      finalPipelines.push({
        $match: this.query.filter,
      });
    }

    if (pipelines) {
      finalPipelines.push(...pipelines);
    }

    if (this.query.sort) {
      finalPipelines.push({
        $sort: this.query.sort,
      });
    }

    const facetData: any[] = [{ $skip: skip }, { $limit: this.query.limit }];

    const unwindPipeline = finalPipelines.find(
      (pipeline) => "$unwind" in pipeline,
    );
    if (unwindPipeline) {
      console.log("has unwinded pipeline");
      facetData.push({
        $replaceRoot: { newRoot: unwindPipeline["$unwind"] },
      });
    }

    console.log("pipelines", pipelines);
    console.log("finalPipelines", finalPipelines);

    const paginatedPipeline = [
      ...finalPipelines,
      {
        $facet: {
          totalCount: [{ $count: "total" }],
          data: facetData,
        },
      },
    ];

    const result = await collection
      .aggregate<{
        totalCount: { total: number }[];
        data: D[];
      }>(paginatedPipeline)
      .toArray();

    const totalCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;

    const data = result[0].data;

    const hasNextPage =
      this.criteria.currentPage * this.query.limit < totalCount;

    return {
      nextPag: hasNextPage ? this.criteria.currentPage + 1 : null,
      prevPag:
        this.criteria.currentPage > 1 ? this.criteria.currentPage - 1 : null,
      count: totalCount,
      results: data,
    };
  }

  protected async paginatedArrayField<D>(
    criteria: Criteria,
    arrayFieldName: string,
  ): Promise<D[]> {
    this.criteria = criteria;
    this.query = this.criteriaConverter.convert(criteria);

    const projection: { [key: string]: any } = {};
    projection[arrayFieldName] = {
      $slice: [Number(this.query.skip), Number(this.query.limit)],
    };

    const collection = await this.collection();

    return await collection
      .find<D>(this.query.filter, { projection })
      .sort(this.query.sort)
      .toArray();
  }

  private createObjectPaginate<T>(documents: T[], count: number): Paginate<T> {
    const hasNextPage: boolean =
      this.criteria.currentPage * this.criteria.limit < count;

    if (documents.length === 0) {
      return {
        nextPag: null,
        prevPag: null,
        count: 0,
        results: [],
      };
    }

    return {
      nextPag: hasNextPage ? Number(this.criteria.currentPage) + 1 : null,
      prevPag: null,
      count: count,
      results: documents,
    };
  }
}
