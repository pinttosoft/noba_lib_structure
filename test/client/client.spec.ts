import {
  AccountMongoRepository,
  AccountType,
  ClientFactory,
  ClientMongoRepository,
  IndividualDTO,
} from "../../src";

describe("Client", () => {
  it("new indivual account", async () => {
    const payload = {
      firstName: "felipe",
      middleName: "moura",
      lastName: "silva",
      email: "felipe@email222.com",
      dateBirth: "1987-02-23",
      dni: "187263254",
      taxId: "",
      passport: "5882997992",
      phoneCountry: "+55",
      phoneNumber: "2191256101",
      streetOne: "rua dos bobos, 0",
      streetTwo: "rua vazia, 1",
      postalCode: "33106",
      city: "MIAMI",
      region: "FLORIDA",
      country: "US",
      referredByAccountId: "",
    } as unknown as IndividualDTO;

    const account =
      await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");

    const client = await ClientFactory.createNewClient(
      payload,
      AccountType.INDIVIDUAL,
      account,
    );
  });

  it("should return data of the client", async () => {
    const client = await ClientMongoRepository.instance().findByClientId(
      "DE-PRUEBA PARA PRUEBA (XXXX)66.716.343/0001-82",
    );
    console.log(client);
  });

  it("should update data of the client", async () => {
    const client =
      await ClientMongoRepository.instance().findByClientId("PNOBA123654");

    const data = client.toPrimitives();

    data.firstName = "Angel Test";
    data.middleName = "Angel Test";
    data.lastName = "Angel Test";
    client.updateData(data);

    await ClientMongoRepository.instance().upsert(client);
  });
});
