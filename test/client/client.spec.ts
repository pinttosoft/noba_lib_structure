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
      "B-LINE TRANSPORTATION",
    );
    console.log(client);
  });

  it("should return data of the client by email", async () => {
    const client = await ClientMongoRepository.instance().findByEmail(
      "programador.angel@gmail.com",
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

  it("Approve client", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();

    const payload = {
      firstName: "crash",
      middleName: "naugthy dog",
      lastName: "bandcoot",
      email: "crash@universal.com",
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

    const account =
      await AccountMongoRepository.instance().findByAccountId("DANIELLEE002");

    const client = await ClientFactory.createNewClient(
      payload,
      AccountType.INDIVIDUAL,
      account,
    );

    client.approveSegregated();

    await clientRepo.upsert(client);
  });

  it("Reject client", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();

    const payload = {
      firstName: "mario",
      middleName: "luigi",
      lastName: "bros XD",
      email: "mario@nintendo.com",
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

    client.rejectSegregated();

    await clientRepo.upsert(client);
  });

  it("Add kyc requested changes to client", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();
    const email: string = "sonic_kyc@pc.com";
    const payload = {
      firstName: "kyc sonic",
      middleName: "luigi",
      lastName: "bros XD",
      email,
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

    client.setKycActions([
      { action: "cambiar foto de perfil", date: new Date() },
    ]);

    client.setKycActions([
      { action: "agregar foto de pasaporte", date: new Date() },
    ]);

    await clientRepo.upsert(client);
  });
});
