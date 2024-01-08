import {
  Criteria,
  Filters,
  MongoClientFactory,
  MongoRepository,
  Operator,
  Order,
  OrderTypes,
  Paginate,
  User,
} from "../../src";

export class BkUserMongoRepository extends MongoRepository<User> {
  private static _instance: BkUserMongoRepository;

  collectionName(): string {
    return "user_app";
  }

  public static instance(): BkUserMongoRepository {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BkUserMongoRepository();
    return this._instance;
  }

  constructor() {
    super(MongoClientFactory.createClient());
  }

  async fetchCriteria(criteria: Criteria): Promise<Paginate<User>> {
    const users: User[] = await this.searchByCriteria(criteria);

    return this.buildPaginate<User>(users);
  }
}

const prepare = (reqFilters: any): Criteria => {
  const filters: any = [];

  if (reqFilters.startDate && typeof reqFilters.endDate == "undefined") {
    filters.push(
      new Map<string, any>([
        ["field", "createdAt"],
        ["operator", Operator.GTE],
        ["value", new Date(reqFilters.startDate)],
      ]),
    );
  }
  if (reqFilters.endDate && typeof reqFilters.startDate == "undefined") {
    filters.push(
      new Map<string, any>([
        ["field", "createdAt"],
        ["operator", Operator.LTE],
        ["value", new Date(reqFilters.endDate)],
      ]),
    );
  }

  if (reqFilters?.startDate && reqFilters?.endDate) {
    filters.push(
      new Map<string, string | any>([
        ["field", "createdAt"],
        ["operator", Operator.DATE_RANGE],
        [
          "value",
          {
            startDate: reqFilters.startDate,
            endDate: reqFilters.endDate,
          },
        ],
      ]),
    );
  }

  if (reqFilters.active) {
    filters.push(
      new Map<string, string | boolean>([
        ["field", "active"],
        ["operator", Operator.NOT_EQUAL],
        ["value", reqFilters.active],
      ]),
    );
  }

  if (reqFilters.email) {
    filters.push(
      new Map<string, string | boolean>([
        ["field", "email"],
        ["operator", Operator.CONTAINS],
        ["value", reqFilters.email],
      ]),
    );
  }

  if (reqFilters.country) {
    filters.push(
      new Map<string, string | boolean>([
        ["field", "country"],
        ["operator", Operator.CONTAINS],
        ["value", reqFilters.country],
      ]),
    );
  }

  /*filters.push(
                                new Map<string, any>([
                                  ["field", "clientId"],
                                  ["operator", Operator.EQUAL],
                                  ["value", null],
                                ]),
                              );*/

  return new Criteria(
    Filters.fromValues(filters),
    Order.fromValues("createdAt", OrderTypes.DESC),
    20,
    reqFilters.page,
  );
};
describe("Bakcoffice User", () => {
  it("Search by criteria", async () => {
    const criteria = prepare({ active: true });
    const users =
      await BkUserMongoRepository.instance().fetchCriteria(criteria);

    console.log("users", users.count);
  });
});
