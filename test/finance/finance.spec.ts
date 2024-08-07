import {
  Criteria,
  Filters,
  FinanceMongoRepository,
  Operator,
  Order,
  OrderTypes,
  TypeFinancialMovement,
} from "../../src";

describe("Finance", () => {
  it("Should use aggregation for amount", async () => {
    const filters = [];
    const clientId = "JLanza15781342";
    const assetCode = "BTC";

    filters.push(
      new Map([
        ["field", "clientId"],
        ["operator", Operator.EQUAL],
        ["value", clientId],
      ]),
    );

    filters.push(
      new Map([
        ["field", "exchange.destinationDetails.assetCode"],
        ["operator", Operator.EQUAL],
        ["value", assetCode],
      ]),
    );

    filters.push(
      new Map([
        ["field", "typeFinancialMovement"],
        ["operator", Operator.EQUAL],
        ["value", TypeFinancialMovement.OUTGOING_PAYMENT_BUSINESS_ALLIE],
      ]),
    );

    const criteria = new Criteria(
      Filters.fromValues(filters),
      Order.fromValues("createdAt", OrderTypes.DESC),
      12342134,
      1,
      [
        {
          $group: {
            _id: null,
            totalFromPipeline: {
              $sum: "$amount",
            },
          },
        },
      ],
    );

    const financeRepo = FinanceMongoRepository.instance();

    const res = await financeRepo.list(criteria);

    console.log("res", res);
  });
});
