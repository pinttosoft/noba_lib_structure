import {
  Criteria,
  Filters,
  MongoClientFactory,
  MongoRepository,
  Operator,
  Order,
  OrderTypes,
  Paginate,
} from "../../../shared";
import {
  GetTotalAmountByClientIdFilters,
  IWithdrawalRequestRepository,
} from "../../domain/interfaces/withdrawal_request.interface";
import { WithdrawalRequest } from "../../domain/withdrawal_request";
import {
  Counterparty,
  CounterpartyMongoRepository,
} from "../../../counterparty";
import { logger, WithdrawalType } from "../../../index";

export class WithdrawalRequestMongoRepository
  extends MongoRepository<WithdrawalRequest>
  implements IWithdrawalRequestRepository
{
  private static _instance: WithdrawalRequestMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  static instance(): WithdrawalRequestMongoRepository {
    if (!WithdrawalRequestMongoRepository._instance) {
      WithdrawalRequestMongoRepository._instance =
        new WithdrawalRequestMongoRepository();
    }
    return WithdrawalRequestMongoRepository._instance;
  }

  collectionName(): string {
    return "withdrawal_requests";
  }

  async findByClient(
    clientId: string,
    page = 1,
    perPage = 20,
  ): Promise<Paginate<WithdrawalRequest>> {
    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const criteria: Criteria = new Criteria(
      Filters.fromValues([filterClientId]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      perPage,
      page,
    );

    return await this.list(criteria);
  }

  async list(criteria: Criteria): Promise<Paginate<WithdrawalRequest>> {
    const document = await this.searchByCriteria<WithdrawalRequest>(criteria);

    return this.buildPaginate<WithdrawalRequest>(document);
  }

  async upsert(withdrawal: WithdrawalRequest): Promise<void> {
    logger.info(
      `solicitud de transferencia DB ${withdrawal.getId()} ${JSON.stringify(
        withdrawal.toPrimitives(),
      )}`,
    );
    await this.persist(withdrawal.getId(), withdrawal);
  }

  async findByWithdrawalId(withdrawalId: string): Promise<WithdrawalRequest> {
    const collection = await this.collection();
    const result = await collection.findOne<any>({ withdrawalId });
    if (!result) {
      return undefined;
    }

    const counterparty: Counterparty =
      await CounterpartyMongoRepository.instance().findByClientIdAndCounterPartyIdAndAssetId(
        result.counterparty.counterpartyId,
        result.counterparty.assetId,
        result.clientId,
        result.withdrawalType === WithdrawalType.INTERNAL ? "S" : "N",
      );

    return WithdrawalRequest.fromPrimitives(
      result._id.toString(),
      result,
      counterparty,
    );
  }

  async getTotalAmountByClientId(
    clientId: string,
    filters: GetTotalAmountByClientIdFilters,
  ): Promise<number> {
    const collection = await this.collection();

    const result = collection.aggregate([
      {
        $match: {
          clientId: clientId,
          status: filters.status,
          "counterparty.counterpartyType": filters.counterPartyType,
          ...(filters.withdrawalType && {
            withdrawalType: filters.withdrawalType,
          }),
          ...(filters.startDate &&
            filters.endDate && {
              createdAt: {
                $gte: filters.startDate,
                $lte: filters.endDate,
              },
            }),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalAmount = await result.toArray();
    return totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;
  }

  async getTotalAmountByClientIdGroupByAsset(
    clientId: string,
    filters: GetTotalAmountByClientIdFilters,
  ): Promise<{ [assetId: string]: number }> {
    const collection = await this.collection();

    const result = collection.aggregate([
      {
        $match: {
          clientId: clientId,
          status: filters.status,
          "counterparty.counterpartyType": filters.counterPartyType,
          ...(filters.withdrawalType && {
            withdrawalType: filters.withdrawalType,
          }),
          ...(filters.startDate &&
            filters.endDate && {
              createdAt: {
                $gte: filters.startDate,
                $lte: filters.endDate,
              },
            }),
        },
      },
      {
        $group: {
          _id: "$counterparty.assetId",
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalAmount = await result.toArray();

    return totalAmount.reduce(
      (acc, item) => {
        acc[item._id] = item.totalAmount;
        return acc;
      },
      {} as { [assetId: string]: number },
    );
  }
}
