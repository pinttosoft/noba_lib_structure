import {
  AccountMongoRepository,
  AccountType,
  ClientFactory,
  ClientMongoRepository,
  IAccount,
  IClient,
  IClientRepository,
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
      region: "todo FLORIDA",
      country: "todo US",
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

  // it("Approve client", async () => {
  //   const clientRepo: IClientRepository = ClientMongoRepository.instance();
  //
  //   const payload = {
  //     firstName: "felipe",
  //     middleName: "moura",
  //     lastName: "silva",
  //     email: "felipe@email222.com",
  //     dateBirth: "1987-02-23",
  //     dni: "187263254",
  //     taxId: "",
  //     passport: "5882997992",
  //     phoneCountry: "+55",
  //     phoneNumber: "2191256101",
  //     streetOne: "rua dos bobos, 0",
  //     streetTwo: "rua vazia, 1",
  //     postalCode: "33106",
  //     city: "MIAMI",
  //     region: "todo FLORIDA",
  //     country: "todo US",
  //     referredByAccountId: "",
  //   } as unknown as IndividualDTO;
  //
  //   const account =
  //     await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");
  //
  //   const client = await ClientFactory.createNewClient(
  //     payload,
  //     AccountType.INDIVIDUAL,
  //     account,
  //   );
  //
  //   await clientRepo.upsert(client);
  //
  //   client.approveSegregated();
  //
  //   await clientRepo.upsert(client);
  // });

  it("Reject client", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();

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
      city: "- ASTORIA",
      region: "todo FLORIDA",
      country: "todo US",
      referredByAccountId: "",
    } as unknown as IndividualDTO;

    const account: IAccount =
      await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");

    const client: IClient = await ClientFactory.createNewClient(
      payload,
      AccountType.INDIVIDUAL,
      account,
    );

    // client.approveSegregated();

    client.rejectSegregated();

    await clientRepo.upsert(client);
  });
});
