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

  async findDepositByAssetCodeAndAmountAndStatusAndReference(
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<TransactionDTO | null> {
    const collection = await this.collection();
    const filter = {
      assetCode,
      status,
      amount,
      reference,
      transactionType: TransactionType.DEPOSIT,
    };

    const result = await collection.findOne(filter);

    if (!result) {
      return null;
    }

    return {
      ...result,
      id: result._id.toString(),
    } as unknown as TransactionDTO;
  }

  async findTransactionByClientId(
    accountId: string,
    initDoc?: string,
  ): Promise<Paginate<TransactionDTO>> {
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

    const document = await this.searchByCriteria<TransactionDTO>(criteria);

    return this.buildPaginate<TransactionDTO>(document);
  }

  async findTransactionByTransactionId(
    transactionId: string,
  ): Promise<TransactionDTO | null> {
    const filter = {
      transactionId,
    };
    const collection = await this.collection();
    const result = await collection.findOne(filter);

    if (!result) {
      return null;
    }

    return {
      ...result,
      id: result._id.toString(),
    } as unknown as TransactionDTO;
  }

  async findWithdrawalByClientIdAndAssetCodeAndAmountAndStatusAndReference(
    clientId: string,
    assetCode: string,
    amount: number,
    status: WithdrawalStatus,
    reference: string,
  ): Promise<TransactionDTO> {
    const filter = {
      clientId,
      assetCode,
      status,
      amount,
      reference,
      transactionType: TransactionType.WITHDRAW,
    };
    const collection = await this.collection();
    const result = await collection.findOne(filter);

    if (!result) {
      return null;
    }

    return {
      ...result,
      id: result._id.toString(),
    } as unknown as TransactionDTO;
  }

  async historyTransactionByAssetCodeAndClientId(
    clientId: string,
    assetCode: string,
    initDoc?: string | Number,
  ): Promise<Paginate<TransactionDTO> | null> {
    const filterAccountId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterAssetCode: Map<string, string> = new Map([
      ["field", "assetCode"],
      ["operator", Operator.EQUAL],
      ["value", assetCode],
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

    return this.buildPaginate<TransactionDTO>(document);
  }

  async upsertTransaction(transaction: Transaction): Promise<void> {
    await this.persist(transaction.getId(), transaction.toPrimitives());
  }

  async transactionListing(
    criteria: Criteria,
  ): Promise<Paginate<TransactionDTO>> {
    let document = await this.searchByCriteria<any>(criteria);

    document = document.map((d) => ({
      ...d,
      id: d._id.toString(),
      _id: undefined,
    }));

    return this.buildPaginate<TransactionDTO>(document);
  }
}
