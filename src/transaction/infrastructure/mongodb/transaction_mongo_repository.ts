import { Transaction } from "../../domain/transaction";
import {
  Criteria,
  Filters,
  MongoClientFactory,
  MongoRepository,
  Operator,
  Order,
  OrderTypes,
  Paginate,
  WithdrawalStatus,
} from "../../../shared";
import {
  ITransactionRepository,
  TransactionDTO,
  TransactionType,
} from "../../index";
import {
  Counterparty,
  CounterpartyMongoRepository,
  CounterpartyType,
} from "../../../counterparty";
import { CounterpartyBank } from "../../../banking";
import { CounterpartyAsset } from "../../../asset";

export class TransactionMongoRepository
  extends MongoRepository<Transaction>
  implements ITransactionRepository
{
  private static _instance: TransactionMongoRepository;

  constructor() {
    super(MongoClientFactory.createClient());
  }

  public static instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new TransactionMongoRepository();
    return this._instance;
  }

  collectionName(): string {
    return "transaction";
  }

  async findDepositByAssetIdAndAmountAndStatusAndReference(
    assetId: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<Transaction | undefined> {
    const collection = await this.collection();
    const filter = {
      assetId,
      status,
      amount,
      reference,
      transactionType: TransactionType.DEPOSIT,
    };

    const result = await collection.findOne(filter);

    if (!result) {
      return null;
    }

    const counterparty: Counterparty = this.buildCounterparty(result);
    return Transaction.fromPrimitives(
      result._id.toString(),
      result,
      counterparty,
    );
  }

  async findTransactionByClientId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<Transaction>> {
    const filterAccountId: Map<string, string> = new Map([
      ["field", "accountId"],
      ["operator", Operator.EQUAL],
      ["value", accountId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterAccountId]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      Number(initDoc),
    );

    const document = await this.searchByCriteria<Transaction>(criteria);

    return this.buildPaginate<Transaction>(document);
  }

  async findTransactionByTransactionId(
    transactionId: string,
  ): Promise<Transaction | undefined> {
    const filter = {
      transactionId,
    };
    const collection = await this.collection();
    const result = await collection.findOne(filter);

    if (!result) {
      return undefined;
    }

    const counterparty: Counterparty = this.buildCounterparty(result);

    return Transaction.fromPrimitives(
      result._id.toString(),
      result,
      counterparty,
    );
  }

  private buildCounterparty(result: any): Counterparty {
    return result.counterparty.counterpartyType == CounterpartyType.FIAT
      ? CounterpartyBank.fromPrimitives(
          result.counterparty.id,
          result.counterparty,
        )
      : CounterpartyAsset.fromPrimitives(
          result.counterparty.id,
          result.counterparty,
        );
  }

  async findWithdrawalByClientIdAndAssetIdAndAmountAndStatusAndReference(
    clientId: string,
    assetId: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<Transaction | undefined> {
    const filter = {
      clientId,
      assetId,
      status,
      amount,
      reference,
      transactionType: TransactionType.WITHDRAW,
    };
    const collection = await this.collection();
    const result = await collection.findOne(filter);

    if (!result) {
      return undefined;
    }

    const counterparty: Counterparty = this.buildCounterparty(result);

    return Transaction.fromPrimitives(
      result._id.toString(),
      result,
      counterparty,
    );
  }

  async historyTransactionByAssetIdAndClientId(
    clientId: string,
    assetId: string,
    initDoc?: string | Number,
  ): Promise<Paginate<Transaction> | null> {
    const filterAccountId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterAssetCode: Map<string, string> = new Map([
      ["field", "assetId"],
      ["operator", Operator.EQUAL],
      ["value", assetId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterAccountId, filterAssetCode]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      Number(initDoc === "" ? 1 : initDoc),
    );

    let document = await this.searchByCriteria<any>(criteria);

    document = document.map((d) => ({
      ...d,
      id: d._id.toString(),
      _id: undefined,
    }));

    return this.buildPaginate<Transaction>(document);
  }

  async upsertTransaction(transaction: Transaction): Promise<void> {
    await this.persist(transaction.getId(), transaction.toPrimitives());
  }

  async transactionListing(criteria: Criteria): Promise<Paginate<Transaction>> {
    let document = await this.searchByCriteria<any>(criteria);

    document = document.map((d) => ({
      ...d,
      id: d._id.toString(),
      _id: undefined,
    }));

    return this.buildPaginate<Transaction>(document);
  }
}
