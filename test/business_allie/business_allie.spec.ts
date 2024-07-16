import {
  AccountStatus,
  AccountType,
  AssetMongoRepository,
  BusinessAllie,
  BusinessAllieDTO,
  BusinessAllieMongoRepository,
  BusinessAllieStatus,
  BusinessAllieType,
  Criteria,
  ExchangeMarketRequest,
  ExchangeMongoRepository,
  Filters,
  Operator,
  Order,
  OrderTypes,
  Referred,
  ReferredDTO,
  ReferredStatus,
  WalletMongoRepository,
} from "../../src";
import { DiffusionChannels } from "../../src/business_allie_program/enums/diffussion_channels.enum";
import { FeeLimitsType } from "../../src/business_allie_program/type/fee_limits.type";
import { CreateExchange } from "./other_services/CreateExchange";
import { IntegrationMocked } from "./other_services/integration_mocked";

describe("Business Allie", () => {
  it("Create a Business Allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "Business-WANER1128024080";
    const allieExist: BusinessAllie =
      await businessRepo.getBusinessAllie(clientId);

    if (!allieExist) {
      const alliePayload: BusinessAllieDTO = {
        // client id
        clientId: clientId,
        name: "waner",
        email: "waner@gmail.com",
        referredBy: "string",
        status: BusinessAllieStatus.APPROVED,
        type: BusinessAllieType.ALLIE,
        createdAt: new Date(),
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      bAllie.updateFeeLimits({
        min: 0.2,
        max: 6,
      });
      await businessRepo.upsertBusinessAllie(bAllie);

      return;
    }

    console.log("allie already exists");
  });

  it("Should list allies", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();

    const filterStatus: Map<string, string> = new Map([
      ["field", "status"],
      ["operator", Operator.EQUAL],
      ["value", BusinessAllieStatus.APPROVED],
    ]);

    const criteria: Criteria = new Criteria(
      Filters.fromValues([filterStatus]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      9,
      1,
    );

    const allies = await businessRepo.fetchBusinessAllies(criteria);

    console.log("allies", allies);
  });

  it("Should add opportunity to allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "Business-WANER1128024080";
    const allieExist: BusinessAllie =
      await businessRepo.getBusinessAllie(clientId);
    const referredClientId = "ABejarano187263254";

    if (!allieExist) {
      console.log("error");
    }

    const referredExist: Referred =
      await businessRepo.getReferredByClientId(referredClientId);

    console.log("referredExist", referredExist);

    if (!referredExist) {
      const referredPayload: ReferredDTO = {
        taxId: "ABejarano187263254",
        name: "ABejarano187263254",
        email: "ABejarano187263254@email.com;",
        feeSwap: 0.5,
        type: AccountType.INDIVIDUAL,
        status: ReferredStatus.REFERRED_WITH_ACTIVE_ACCOUNT,
        referredByClientId: clientId,
        clientId: referredClientId,
        createdAt: new Date(),
      };

      await businessRepo.addReferredToAllie(clientId, referredPayload);
    }
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
    const referredClientId = "MSerrano181263254";
    const sourceWalletId: string = "USD";

    const destinationWalletId: string = "BTC";

    const exchangeRequest: ExchangeMarketRequest = {
      amount: 100,
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

  it("Should fetch all referrals", async () => {
    console.log(await BusinessAllieMongoRepository.instance().fetchReferrals());
  });
});
