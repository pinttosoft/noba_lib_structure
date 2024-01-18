import {
  AssetMongoRepository,
  ClientMongoRepository,
  CounterpartyFactoryDTO,
  CounterpartyMongoRepository,
  CounterpartyProfileType,
  CounterpartyStatus,
  CounterpartyType,
  Criteria,
  Filters,
  InstructionsAchPabType,
  Operator,
  Order,
  OrderTypes,
  OriginWallet,
  RegisterOrSearchCounterpartyInternal,
  RelationshipConsumer,
  WalletMongoRepository,
} from "../../src";
import * as console from "console";
import { CounterpartyAchPab } from "../../src/banking/domain/counterparty_ach_pab";
import { CounterpartyAchPabDtoType } from "../../src/banking/domain/types/counterparty_ach_pab_dto.type";
import { v4 } from "uuid";

describe("Counterparty", () => {
  it("should be create new instance to counterparty", async () => {
    const client =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const counterpartyDTO = {
      type: CounterpartyType.CRYPTO,
      client: client,
      informationWallet: {
        assetId: "BITCOIN_TESTNET_BTC",
        address: "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB",
        relationshipConsumer: RelationshipConsumer.CHILDREN,
        originWallet: OriginWallet.OTHER,
      },
      informationOwner: {
        name: "Jose",
        address: { country: "BR" },
      },
    } as unknown as CounterpartyFactoryDTO;

    // const counterparty: Counterparty =
    //   CounterpartyFactory.createNewCounterparty(counterpartyDTO);
  });

  it("should list used criteria method", async () => {
    const clientId = "FSilva187263254";

    const filterClientId: Map<string, string> = new Map([
      ["field", "clientId"],
      ["operator", Operator.EQUAL],
      ["value", clientId],
    ]);

    const filterCounterpartyType: Map<string, string> = new Map([
      ["field", "counterpartyType"],
      ["operator", Operator.EQUAL],
      ["value", CounterpartyType.CRYPTO],
    ]);

    const criteria = new Criteria(
      Filters.fromValues([filterClientId, filterCounterpartyType]),
      Order.fromValues("createdAt", OrderTypes.DESC),
      20,
      1,
    );

    const result = await CounterpartyMongoRepository.instance().list(criteria);
    console.log(result);
  });

  it("should register or search counterparty internal", async () => {
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        "ABejarano187263254",
      );

    const asset = await AssetMongoRepository.instance().findAssetByCode("USD");

    const counterparty = await new RegisterOrSearchCounterpartyInternal(
      WalletMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOrigin, clientDestination, asset);
    console.log(counterparty);
    expect(counterparty.getCounterpartyId()).toBe("ABejarano187263254");
  });

  it("should register and remove accents", async () => {
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        "MSerrano181263254",
      );

    const asset = await AssetMongoRepository.instance().findAssetByCode("USD");

    const counterparty = await new RegisterOrSearchCounterpartyInternal(
      WalletMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOrigin, clientDestination, asset);
    expect(counterparty.getCounterpartyId()).toBe("MSerrano181263254");
  });

  it("Should register a counterparty internal saving new status field", async () => {
    const clientId = "ABejarano187263254";
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        "MSerrano181263254",
      );

    const asset = await AssetMongoRepository.instance().findAssetByCode("USD");

    const counterparty = await new RegisterOrSearchCounterpartyInternal(
      WalletMongoRepository.instance(),
      CounterpartyMongoRepository.instance(),
    ).run(clientOrigin, clientDestination, asset);

    console.log("counterparty", counterparty);

    expect(counterparty.getStatus()).toBe(CounterpartyStatus.ACTIVE);
  });

  it("Should get all external PENDING counterparies", async () => {
    const pendings = await CounterpartyMongoRepository.instance().getPending();

    console.log("pendings", pendings);
  });

  it("Should register an ach pab counterparty internal ", async () => {
    const clientId = "MSerrano181263254";
    const clientDestinationId = "FSilva187263254";
    const clientOrigin =
      await ClientMongoRepository.instance().findByClientId(clientId);

    const clientDestination =
      await ClientMongoRepository.instance().findByClientId(
        clientDestinationId,
      );
    const profileType = CounterpartyProfileType.CORPORATION;

    const asset = await AssetMongoRepository.instance().findAssetByCode("PAB");
    const instructions: InstructionsAchPabType = {
      label: "",
      holderEmail: "panama email",
      accountDestinationNumber: "panama account",
      bankName: "panama bank",
      productType: "panama type",
      holderId: "panama holder id",
      holderName: "panama name",
      concept: "panama concept",
    };

    const payload: CounterpartyAchPabDtoType = {
      accountId: clientDestination.getAccount().getAccountId(),
      achInstructions: instructions,
      clientId: clientOrigin.getClientId(),
      counterpartyId: clientDestination.getClientId(),
      counterpartyType: CounterpartyType.FIAT,
      status: CounterpartyStatus.ACTIVE,
      assetId: asset.getAssetId(),
    };
    /*const counterparty = await new RegisterOrSearchCounterpartyInternal(
                          WalletMongoRepository.instance(),
                          CounterpartyMongoRepository.instance(),
                        ).run(clientOrigin, clientDestination, asset);
                    */
    const counterparty: CounterpartyAchPab = CounterpartyAchPab.newCounterparty(
      payload,
      true,
    );
    await CounterpartyMongoRepository.instance().upsert(counterparty);

    console.log("-counterparty", counterparty.toPrimitives());
    //expect(counterparty.getStatus()).toBe(CounterpartyStatus.ACTIVE);
    //const currecntCOunter = await CounterpartyMongoRepository.instance().findMyCounterpartyByAssetId()
  });

  it("Should register a pab counterparty external ", async () => {
    const webPayload = {
      clientId: "MSerrano181263254",
      clientDestinationId: "FSilva187263254",
    };
    const assetCode = "PAB";
    // todo
    const profileType = CounterpartyProfileType.CORPORATION;

    const clientOrigin = await ClientMongoRepository.instance().findByClientId(
      webPayload.clientId,
    );

    const asset =
      await AssetMongoRepository.instance().findAssetByCode(assetCode);

    const instructions: InstructionsAchPabType = {
      label: "",
      holderEmail: "panama email",
      accountDestinationNumber: "panama account",
      bankName: "panama bank",
      productType: "panama type",
      holderId: "panama holder id",
      holderName: "panama name",
      concept: "panama concept",
    };

    const payload: CounterpartyAchPabDtoType = {
      accountId: "",
      achInstructions: instructions,
      clientId: clientOrigin.getClientId(),
      counterpartyId: v4(),
      counterpartyType: CounterpartyType.FIAT,
      status: CounterpartyStatus.ACTIVE,
      assetId: asset.getAssetId(),
    };

    const counterparty: CounterpartyAchPab = CounterpartyAchPab.newCounterparty(
      payload,
      false,
    );

    await CounterpartyMongoRepository.instance().upsert(counterparty);

    console.log("-counterparty", counterparty.toPrimitives());
    //expect(counterparty.getStatus()).toBe(CounterpartyStatus.ACTIVE);
    //const currecntCOunter = await CounterpartyMongoRepository.instance().findMyCounterpartyByAssetId()
  });

  it("Delete an ach counterparty", async () => {
    //await CounterpartyMongoRepository.instance().delete();
  });
});
