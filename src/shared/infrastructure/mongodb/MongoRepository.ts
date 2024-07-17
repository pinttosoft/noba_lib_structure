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
  ): Promise<Paginate<D>> {
    this.criteria = criteria;
    this.query = this.criteriaConverter.convert(criteria);
    const collection = await this.collection();

    const skip = (this.criteria.currentPage - 1) * this.query.limit;

    if (this.query.filter) {
      this.query.pipelines.push({
        $match: this.query.filter,
      });
    }

    if (this.query.sort) {
      this.query.pipelines.push({
        $sort: this.query.sort,
      });
    }

    const facetData: any[] = [{ $skip: skip }, { $limit: this.query.limit }];

    const unwindPipeline = this.query.pipelines.find(
      (pipeline) => "$unwind" in pipeline,
    );
    if (unwindPipeline) {
      facetData.push({
        $replaceRoot: { newRoot: unwindPipeline["$unwind"] },
      });
    }

    const paginatedPipeline = [
      ...this.query.pipelines,
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

  // protected async paginateAggregation<D>(
  //   pipeline: any[],
  //   currentPage: number,
  //   limit: number,
  //   unwind?: string,
  // ): Promise<Paginate<D>> {
  //   const collection = await this.collection();
  //
  //   const skip = (currentPage - 1) * limit;
  //
  //   const facetData: any[] = [{ $skip: skip }, { $limit: limit }];
  //   if (unwind) {
  //     facetData.push({
  //       $replaceRoot: { newRoot: "$referrals" },
  //     });
  //   }
  //
  //   const paginatedPipeline = [
  //     ...pipeline,
  //     {
  //       $facet: {
  //         totalCount: [{ $count: "total" }],
  //         data: facetData,
  //       },
  //     },
  //   ];
  //
  //   const result = await collection
  //     .aggregate<{
  //       totalCount: { total: number }[];
  //       data: D[];
  //     }>(paginatedPipeline)
  //     .toArray();
  //
  //   const totalCount =
  //     result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;
  //
  //   const data = result[0].data;
  //
  //   const hasNextPage = currentPage * limit < totalCount;
  //
  //   return {
  //     nextPag: hasNextPage ? currentPage + 1 : null,
  //     prevPag: currentPage > 1 ? currentPage - 1 : null,
  //     count: totalCount,
  //     results: data,
  //   };
  // }
}
