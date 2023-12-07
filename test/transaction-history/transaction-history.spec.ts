import {
  Criteria,
  FilterBetweenDate,
  Filters,
  Operator,
  Order,
  OrderTypes,
  TransactionMongoRepository,
} from "../../src";

describe("Transaction History", () => {
  it("list transactions by date between", async () => {
    const transactionRepo = TransactionMongoRepository.instance();

    const payload = {
      clientId: "MSerrano181263254",
      page: "1",
      perPage: "20",
      startDate: "2018-01-01T12:24:03.000Z",
      endDate: "2018-10-24T12:24:03.000Z",
    };

    const criteria = new Criteria(
      Filters.fromValues(prepareFilter(payload)),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const res = await transactionRepo.transactionListing(criteria);
    expect(res.results.length).toBeGreaterThan(0);
  });
});

const prepareFilter = (payload): Array<Map<string, any>> => {
  const filters = [];
  const filterClientId: Map<string, any> = new Map([
    ["field", "clientId"],
    ["operator", Operator.EQUAL],
    ["value", payload.clientId],
  ]);

  filters.push(filterClientId);

  if (payload?.transactionType) {
    filters.push(
      new Map([
        ["field", "transactionType"],
        ["operator", Operator.EQUAL],
        ["value", payload.transactionType],
      ]),
    );
  }

  if (payload?.transactionId) {
    filters.push(
      new Map([
        ["field", "transactionId"],
        ["operator", Operator.EQUAL],
        ["value", payload.transactionId],
      ]),
    );
  }

  if (payload?.assetType) {
    filters.push(
      new Map([
        ["field", "assetType"],
        ["operator", Operator.EQUAL],
        ["value", payload.assetType],
      ]),
    );
  }

  if (payload?.assetId) {
    filters.push(
      new Map([
        ["field", "assetId"],
        ["operator", Operator.EQUAL],
        ["value", payload.assetId],
      ]),
    );
  }

  // filter dates
  if (payload?.startDate && payload?.endDate) {
    filters.push(
      new Map<string, string | FilterBetweenDate>([
        ["field", "createdAt"],
        ["operator", Operator.DATE_RANGE],
        [
          "value",
          {
            startDate: payload.startDate,
            endDate: payload.endDate,
          },
        ],
      ]),
    );
  }

  return filters;
};
