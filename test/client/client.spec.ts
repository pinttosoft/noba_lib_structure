import {
  AccountMongoRepository,
  AccountType,
  ClientFactory,
  ClientMongoRepository,
  IAccount,
  IClient,
  IClientRepository,
  Documents,
  DocumentSide,
  DocumentType,
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
      { action: "cambiar foto de perfil", date: new Date(), id: "" },
    ]);

    client.setKycActions([
      { action: "agregar foto de pasaporte", date: new Date(), id: "" },
    ]);

    await clientRepo.upsert(client);
  });

  it("Get kyc actions", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();
    const client = await clientRepo.findByClientId("kbros-XD187263254");

    client.setKycActions([{ action: "agregado ", date: new Date(), id: "" }]);

    await clientRepo.upsert(client);
  });

  it("Delete kyc action", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();
    const client: IClient =
      await clientRepo.findByClientId("kbros-XD187263254");

    client.deleteKycAction("kyc-0.18776280337277518");

    await clientRepo.upsert(client);
  });

  it("Add KYC to company client partner", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();
    const client: IClient = await clientRepo.findByClientId(
      "DE-PRUEBA PARA PRUEBA (XXXX)66.716.343/0001-82",
    );

    client.setKycActionsToPartner({
      action: "rk",
      date: new Date(),
      dni: "11111",
      id: "555",
    });

    client.setKycActionsToPartner({
      action: "2 test",
      date: new Date(),
      dni: "187263254",
      id: "2",
    });

    client.setKycActionsToPartner({
      action: "final test",
      date: new Date(),
      dni: "11111",
      id: "142fgdasfgdfg",
    });

    await clientRepo.upsert(client);
  });

  it("Delete kyc action to partner", async () => {
    const clientRepo: IClientRepository = ClientMongoRepository.instance();
    const client: IClient = await clientRepo.findByClientId(
      "DE-PRUEBA PARA PRUEBA (XXXX)66.716.343/0001-82",
    );

    client.deleteKycActionToPartner({
      action: "rk",
      date: new Date(),
      dni: "187263254",
      id: "1",
    });

    await clientRepo.upsert(client);
  });

  it("should return data of the client company", async () => {
    const client = await ClientMongoRepository.instance().findByClientId(
      "pinttosoftpinttosoft",
    );

    // asignar docuemnto a socios
    const partner = client.getCompanyToPrimitives().partners[0];
    client.deleteAllDocuemtnsPartners(partner.dni);

    client.setDocument(
      partner.dni,
      Documents.newDocument(
        partner.dni,
        "/home/abejarano/Downloads/2.png",
        DocumentType.GOVERNMENT_ID,
        DocumentSide.BACK,
      ),
    );
    await ClientMongoRepository.instance().upsert(client);

    const client2 = await ClientMongoRepository.instance().findByClientId(
      "pinttosoftpinttosoft",
    );
    client2.setDocument(
      partner.dni,
      Documents.newDocument(
        partner.dni,
        "/home/abejarano/Downloads/2-FRONT.png",
        DocumentType.GOVERNMENT_ID,
        DocumentSide.FRONT,
      ),
    );
    await ClientMongoRepository.instance().upsert(client2);

    expect(client.toPrimitives().partners[0].documents.length === 1).toBe(true);
  });

  // it("test", async () => {
  //   //
  //   let MONGO_PASS =
  //     process.env.NODE_ENV === "prod" ? process.env.MONGO_PASS : "zrfhowt0cguf";
  //   let MONGO_USER =
  //     process.env.NODE_ENV === "prod"
  //       ? process.env.MONGO_USER
  //       : "noab-dev-mongodb";
  //   let MONGO_DB =
  //     process.env.NODE_ENV === "prod" ? process.env.MONGO_DB : "dbnobadev";
  //   let MONGO_SERVER =
  //     process.env.NODE_ENV === "prod"
  //       ? process.env.MONGO_SERVER
  //       : "cluster0.xdwtnb4.mongodb.net";
  //   const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}/${MONGO_DB}?retryWrites=true&w=majority`;
  //
  //   console.log("uri", uri);
  //   const client = new MongoClient(uri, {});
  //
  //   await client.connect();
  //   const database: Db = client.db("dbnobadev");
  //
  //   const accountsCollection = database.collection("accounts");
  //   const accounts = accountsCollection.find();
  //
  //   const accountIdToPreserve = [
  //     "DANIELLEE002",
  //     "DANIELLEE002",
  //     "AngelVicen-186263254",
  //     "DANIELLEE002",
  //     "DANIELLEE002",
  //     "JOnathanJo-12131548454",
  //     "PosubePosu-12344321",
  //   ];
  //
  //   console.log("accounts", accounts);
  //
  //   await accountsCollection.deleteMany({
  //     accountId: { $nin: accountIdToPreserve },
  //   });
  //
  //   console.log("Accounts deleted successfully.");
  // });

  it("should return data of the client", async () => {
    const client = await ClientMongoRepository.instance().findByAccountId(
      "PosubePosu-12344321",
    );
    console.log(client);
  });
});
