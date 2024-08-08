import {
  AccountStatus,
  AccountType,
  AssetMongoRepository,
  BusinessAllie,
  BusinessAllieDTO,
  BusinessAllieMongoRepository,
  BusinessAllieStatus,
  BusinessAllieType,
  ClientMongoRepository,
  Criteria,
  ExchangeMarketRequest,
  ExchangeMongoRepository,
  Filters,
  Finance,
  FinanceMongoRepository,
  FinancialMovement,
  FinancialMovementStatus,
  Operator,
  Order,
  OrderTypes,
  Referred,
  ReferredDTO,
  ReferredStatus,
  TypeFinancialMovement,
  User,
  UserMongoRepository,
  WalletMongoRepository,
} from "../../src";
import { DiffusionChannels } from "../../src/business_allie_program/enums/diffussion_channels.enum";
import { FeeLimitsType } from "../../src/business_allie_program/type/fee_limits.type";
import { CreateExchange } from "./other_services/CreateExchange";
import { IntegrationMocked } from "./other_services/integration_mocked";
import { v4 } from "uuid";

describe("Business Allie", () => {
  it("Create a Business Allie", async () => {
    const link = v4();
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "Business-WANER1128024080";
    const allieExist: BusinessAllie =
      await businessRepo.getBusinessAllie(clientId);

    if (!allieExist) {
      const client =
        await ClientMongoRepository.instance().findByClientId(clientId);
      // console.log(client);

      const alliePayload: BusinessAllieDTO = {
        clientId: clientId,
        name: client.getName(),
        email: client.getEmail(),
        link: link,
        referredBy: "Salazar",
        status: BusinessAllieStatus.PENDING_REVISION,
        type: BusinessAllieType.ALLIE,
        createdAt: new Date(),
        client,
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      bAllie.updateFeeLimits({
        min: 0.2,
        max: 6,
      });
      await businessRepo.upsertBusinessAllie(bAllie);

      console.log("allie created!");

      return;
    }

    console.log("allie already exists");
  });

  it("Should list allies", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();

    const filterStatus: Map<string, string> = new Map([
      ["field", "status"],
      // ["field", "client.status"],
      ["operator", Operator.EQUAL],
      ["value", BusinessAllieStatus.APPROVED],
    ]);

    const filterEmail: Map<string, string> = new Map([
      ["field", "email"],
      // ["field", "client.status"],
      ["operator", Operator.EQUAL],
      ["value", "johana@gmail.com"],
    ]);

    const criteria: Criteria = new Criteria(
      Filters.fromValues([filterStatus, filterEmail]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      9,
      1,
    );

    const allies = await businessRepo.fetchBusinessAllies(criteria);

    console.log("allies", allies);
  });

  it("Should add referred to allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "MSerrano181263254";
    const allieExist: BusinessAllie =
      await businessRepo.getBusinessAllie(clientId);
    const referredClientId = "ABejarano187263254";

    if (!allieExist) {
      console.log("error");
    }

    const referredExist: Referred =
      await businessRepo.getReferredByClientId(referredClientId);

    if (!referredExist) {
      const referredPayload: ReferredDTO = {
        taxId: "",
        name: "asdf",
        email: "a1@email.com;",
        feeSwap: 0.5,
        type: AccountType.INDIVIDUAL,
        status: ReferredStatus.REFERRED_REGISTERED_BY_ALLIE,
        referredByClientId: clientId,
        createdAt: new Date(),
        birthdate: new Date("11-11-1980"),
        phoneNumber: "+1 1234 41234123",
        address: "Ocean Av. 1234, miami fl",
      };

      await businessRepo.addReferredToAllie(clientId, referredPayload);

      console.log("Referred created");
      return;
    }

    console.log("referredExist", referredExist);
  });

  it("Should create a marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "JLanza15781342";
    const allieExist: BusinessAllie =
      await businessRepo.getBusinessAllie(clientId);

    if (!allieExist) {
      const alliePayload: BusinessAllieDTO = {
        clientId: clientId,
        name: "johana",
        diffusionChanel: DiffusionChannels.FACEBOOK,
        link: "facebook.com/johana",
        email: "johana@gmail.com",
        referredBy: "string",
        status: BusinessAllieStatus.APPROVED,
        type: BusinessAllieType.MARKETER,
        createdAt: new Date(),
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      await businessRepo.upsertBusinessAllie(bAllie);

      return;
    }

    console.log("allie already exists");
  });

  it("Should delete marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    await businessRepo.deleteBusinessAllie(clientId);
  });

  it("Should edit marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "JLanza15781342";
    const allie: BusinessAllie = await businessRepo.getBusinessAllie(clientId);

    allie.updateStatus(BusinessAllieStatus.DENIED);

    const feeLimits: FeeLimitsType = {
      min: 0.2,
      max: 6,
    };

    allie.updateFeeLimits(feeLimits);
    console.log("allie to primitives", allie.toPrimitives());

    await businessRepo.upsertBusinessAllie(allie);
  });

  it("Should add referred to a marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    const referredPayload: ReferredDTO = {
      clientId: "12345",
      taxId: "1st_reffered_johana",
      name: "amigo de johana 3",
      email: "amigo_johana3@email.com",
      feeSwap: 2,
      type: AccountType.INDIVIDUAL,
      status: ReferredStatus.REFERRED_REGISTERED_BY_ALLIE,
      referredByClientId: clientId,
      createdAt: new Date(),
    };

    await businessRepo.addReferredToAllie(clientId, referredPayload);
  });

  it("Should edit referred of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const referredTaxId = "1st_reffered_johana";

    const referred: Referred =
      await businessRepo.getReferredByTaxId(referredTaxId);
    console.log("referred", referred);
    referred.setStatus(ReferredStatus.REFERRED_WITH_ACTIVE_ACCOUNT);
    referred.setFeeSwap(0.3);

    await businessRepo.updateReferredData(referred);
  });

  it("Should delete referred of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";
    const referredClientId = "12";

    console.log(
      "1st referrals",
      await businessRepo.getReferralsByClientId(clientId),
    );

    await businessRepo.deleteReferred(clientId, referredClientId);

    console.log(
      "2nd referrals",
      await businessRepo.getReferralsByClientId(clientId),
    );
  });

  it("Should list referrals of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    const referrals = await businessRepo.getReferralsByClientId(clientId);

    console.log("referrals", referrals);
  });

  it("Should save a Exchange of  my referred usd to btc", async () => {
    const referredClientId = "JLanza15781342";
    const sourceWalletId: string = "USD";
    const destinationWalletId: string = "BTC";

    const exchangeRequest: ExchangeMarketRequest = {
      amount: 11,
      clientId: referredClientId,
      description: "test in lib for comission's allie",
      destinationWalletId: destinationWalletId,
      sourceWalletId: sourceWalletId,
    };

    const exchange = await new CreateExchange(
      ExchangeMongoRepository.instance(),
      new IntegrationMocked(),
      WalletMongoRepository.instance(),
      AssetMongoRepository.instance(),
      BusinessAllieMongoRepository.instance(),
    ).run(exchangeRequest);

    console.log("exchange", exchange);
  });

  it("Should save a Exchange of  my referred btc to usd", async () => {
    const referredClientId = "MSerrano181263254";
    const sourceWalletId: string = "BTC";

    const destinationWalletId: string = "USD";

    const exchangeRequest: ExchangeMarketRequest = {
      amount: 0.003,
      clientId: referredClientId,
      description: "test in lib for comission's allie",
      destinationWalletId: destinationWalletId,
      sourceWalletId: sourceWalletId,
    };

    const exchange = await new CreateExchange(
      ExchangeMongoRepository.instance(),
      new IntegrationMocked(),
      WalletMongoRepository.instance(),
      AssetMongoRepository.instance(),
      BusinessAllieMongoRepository.instance(),
    ).run(exchangeRequest);

    console.log("exchange", exchange);
  });

  it("Should update account status of referred", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const referredTaxId = "MSerrano181263254";

    const referred: Referred =
      await businessRepo.getReferredByTaxId(referredTaxId);
    console.log("referred", referred);
    referred.updateAccountStatus(AccountStatus.CHANGES_REQUESTED);

    await businessRepo.updateReferredData(referred);
  });

  it("Set user as referred ", async () => {
    const clientId = "MSerrano181263254";
    const user: User =
      await UserMongoRepository.instance().findByEmail("moycs777@gmail.com");
    if (!user) {
      console.error("User not found to be linked to a new user");
      return;
    }

    user.setReferredByClientId(clientId);

    await UserMongoRepository.instance().upsert(user);
  });

  it("should get referred by email", async () => {
    const email = "qwerqwer@email.com;";
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const referred: Referred = await businessRepo.getReferredByEmail(email);
    console.log("referred", referred);
  });

  it("should get allie by referred id", async () => {
    const referredClientId: string = "JLanza15781342";
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const allie =
      await businessRepo.getBusinessAllieByReferredClientId(referredClientId);
    console.log("allie", allie);
  });

  it("Should save exchange into finance", async () => {
    const exchangeId: string = "1d823927-338c-4b75-b167-e4cae676b674";
    const clientId: string = "JLanza15781342";

    const exchange =
      await ExchangeMongoRepository.instance().getExchangeById(exchangeId);

    const financePayload: FinancialMovement = {
      clientId,
      createdAt: new Date(),
      referenceId: exchange.getExchangeId(),
      amount: 20,
      typeFinancialMovement: TypeFinancialMovement.SWAP,
      status: FinancialMovementStatus.PENDING,
      exchange,
    };

    const finance = new Finance(financePayload);

    await FinanceMongoRepository.instance().upsert(finance);

    console.log(finance);
  });

  it("Should get al commissions", async () => {
    const financeRepo = FinanceMongoRepository.instance();

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", "JLanza15781342"],
    ]);

    const filterTypeFinancialMovement: Map<string, string> = new Map([
      ["field", "typeFinancialMovement"],
      ["operator", Operator.EQUAL],
      ["value", "OUTGOING_PAYMENT_BUSINESS_ALLIE"],
    ]);

    const criteria: Criteria = new Criteria(
      Filters.fromValues([filterClientId, filterTypeFinancialMovement]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      9,
      1,
    );

    const res = await financeRepo.list(criteria);

    console.log("res", res);

    expect(res.results.length).not.toBe(0);
  });

  it("Should get allie consolidate", async () => {
    const clientId = "JLanza15781342";
    const financeRepo = FinanceMongoRepository.instance();
    const consolidate = await financeRepo.getAllieSwapConsolidate(
      clientId,
      "ETH",
    );
    console.log("consolidate", consolidate);
  });

  it("Should paginated referrals to allie", async () => {
    const clientId = "JLanza15781342";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId]),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      2,
      1,
    );

    const paginate =
      await BusinessAllieMongoRepository.instance().paginateReferrals(criteria);

    expect(paginate.results.length).toBeGreaterThanOrEqual(2);
    expect(paginate.nextPag).toBe(2);
  });

  it("Should paginate all referrals", async () => {
    const clientId = "JLanza15781342";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    // moises.alejandro.serrano@gmail.com
    const filterEmail = new Map([
      ["field", "referrals.email"],
      ["operator", Operator.EQUAL],
      ["value", "moises.alejandro.serrano@gmail.com"],
    ]);
    const criteria = new Criteria(
      Filters.fromValues([filterEmail]),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const paginate =
      await BusinessAllieMongoRepository.instance().fetchReferrals(criteria);

    console.log(paginate);
  });

  it("Should export allies", async () => {
    const clientId = "JLanza15781342";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([]),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const res =
      await BusinessAllieMongoRepository.instance().exportAllies(criteria);

    expect(res).not.toBe(undefined);
  });

  it("Should export referrals", async () => {
    const clientId = "JLanza15781342";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId]),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const res =
      await BusinessAllieMongoRepository.instance().exportReferrals(criteria);

    console.log("res", res);
    expect(res).not.toBe(undefined);
  });

  it("Should export finance", async () => {
    const clientId = "JLanza15781342";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const typeMovemenFilter: Map<string, string> = new Map([
      ["field", "typeFinancialMovement"],
      ["operator", Operator.EQUAL],
      ["value", TypeFinancialMovement.OUTGOING_PAYMENT_BUSINESS_ALLIE],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId, typeMovemenFilter]),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const res = await FinanceMongoRepository.instance().exportFinance(criteria);
    console.log("res", res);
    expect(res).not.toBe(undefined);
  });

  it("Should search referrals", async () => {
    const filters = [];

    const clientId = "JLanza15781342";

    filters.push(
      new Map([
        ["field", "clientId"],
        ["operator", Operator.EQUAL],
        ["value", clientId],
      ]),
    );

    filters.push(
      new Map([
        ["field", "referrals.email"],
        ["operator", Operator.EQUAL],
        ["value", "zxcv@gmail.com"],
      ]),
    );

    filters.push(
      new Map([
        ["field", "referrals.name"],
        ["operator", Operator.EQUAL],
        ["value", "zxcv"],
      ]),
    );
    //
    filters.push(
      new Map([
        ["field", "referrals.type"],
        ["operator", Operator.EQUAL],
        ["value", "COMPANY"],
      ]),
    );

    const criteria = new Criteria(
      Filters.fromValues(filters),
      Order.fromValues("referrals.createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const paginate =
      await BusinessAllieMongoRepository.instance().fetchReferrals(criteria);

    console.log(paginate);
  });
});
