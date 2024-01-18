import {
  Criteria,
  FilterBetweenDate,
  Filters,
  IClient,
  Operator,
  Order,
  OrderTypes,
  Paginate,
} from "../../../src";
import { BkClientMongoRepository } from "./bk-client-mongo-repository";
import { clientListDto } from "../client-list-dto";

describe("Back office Clients", () => {
  it("Get all clients", async () => {
    const criteria = prepare({ page: 1 });
    const clients: Paginate<IClient> =
      await BkClientMongoRepository.instance().fetchCriteria(criteria);
    console.log("-- clients", clients);

    const res = await clientListDto(clients);
    console.log("-- res", res);
  });
});

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
      new Map<string, string | FilterBetweenDate>([
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

  if (reqFilters?.status) {
    filters.push(
      new Map<string, string>([
        ["field", "status"],
        ["operator", Operator.EQUAL],
        ["value", reqFilters.status],
      ]),
    );
  }

  if (reqFilters?.type) {
    filters.push(
      new Map<string, string>([
        ["field", "type"],
        ["operator", Operator.EQUAL],
        ["value", reqFilters.type],
      ]),
    );
  }

  if (reqFilters.isSegregated) {
    const isSegregated: boolean = reqFilters.isSegregated === "true";

    filters.push(
      new Map<string, string | boolean>([
        ["field", "isSegregated"],
        ["operator", Operator.EQUAL],
        ["value", isSegregated],
      ]),
    );
  }

  if (reqFilters.firstName) {
    filters.push(
      new Map<string, string | boolean>([
        ["field", "firstName"],
        ["operator", Operator.CONTAINS],
        ["value", reqFilters.firstName],
      ]),
    );
  }

  return new Criteria(
    Filters.fromValues(filters),
    Order.fromValues("createdAt", OrderTypes.DESC),
    20,
    reqFilters.page,
  );
};
