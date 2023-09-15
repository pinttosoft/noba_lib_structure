import {
  ClientMongoRepository,
  Counterparty,
  CounterpartyFactoryDTO,
  CounterpartyType,
  OriginWallet,
  RelationshipConsumer,
  WalletInformationDTO,
} from "../../src";
import { CounterpartyFactory } from "../../src/counterparty/domain/factories/counterparty.factory";

describe("Counterparty", () => {
  it("should be create new instance to counterparty", async () => {
    const client =
      await ClientMongoRepository.instance().findByClientId("FSilva187263254");

    console.log(client);

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

    const counterparty: Counterparty =
      CounterpartyFactory.createNewCounterparty(counterpartyDTO);
  });
});
