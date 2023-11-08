import {
  ExchangeMongoRepository,
  ExchangeStatus,
  FinanceMongoRepository,
  Operator,
  Order,
  OrderTypes,
  TypeFinancialMovement,
} from "../../src";
import { MongoFilterBetweenDate } from "../../src/shared/infrastructure/mongodb/MongoCriteriaConverter";

describe("Finance", () => {
  it("Should get all wire in fee incomes", async () => {
    const repo = FinanceMongoRepository.instance();

    const filters = [];
    filters.push(
      new Map<string, string | MongoFilterBetweenDate>([
        ["field", "createdAt"],
        ["operator", Operator.DATE_RANGE],
        [
          "value",
          {
            startDate: new Date().toString(),
            endDate: new Date().toString(),
          },
        ],
      ]),
    );

    const order = Order.fromValues("createdAt", OrderTypes.DESC);
    const resWireInInter = await repo.finance(
      TypeFinancialMovement.INCOMMING_WIRE_INTERNATIONAL,
    );
    console.log("resWireInInter", resWireInInter);

    const resWireOutInter = await repo.finance(
      TypeFinancialMovement.OUTGOING_WIRE_INTERNATIONAL,
    );
    console.log("resWireOutInter", resWireOutInter);

    const resWireInDomestic = await repo.finance(
      TypeFinancialMovement.INCOMMING_WIRE_DOMESTIC,
    );
    console.log("resWireInDomestic", resWireInDomestic);

    const resWireOutDomestic = await repo.finance(
      TypeFinancialMovement.OUTGOING_WIRE_DOMESTIC,
    );
    console.log("resWireOutDomestic", resWireOutDomestic);

    const resSwap = await repo.finance(TypeFinancialMovement.SWAP);
    console.log("resSwap", resSwap);
  });

  it("Should get all swap volumes", async () => {
    const repo = ExchangeMongoRepository.instance();

    const res = await repo.finance({ status: ExchangeStatus.ACCEPTED });
    console.log("res", res);
  });
});
