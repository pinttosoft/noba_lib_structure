import {
  AccountMongoRepository,
  AccountType,
  ClientFactory,
  ClientMongoRepository,
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

  it("should return data of the client company", async () => {
    const client = await ClientMongoRepository.instance().findByClientId(
      "pinttosoftpinttosoft",
    );
    const doc = Documents.newDocument(
      client.getClientId(),
      "/home/abejarano/Downloads/1.png",
      DocumentType.INCORPORATION_DOCUMENT,
      DocumentSide.FRONT,
    );
    client.setDocument(client.getIDNumber(), doc);

    expect(client.toPrimitives().documents.length > 0).toBe(true);

    // asignar docuemnto a socios
    const partner = client.getCompanyToPrimitives().partners[0];
    const docPartner = Documents.newDocument(
      partner.dni,
      "/home/abejarano/Downloads/1.png",
      DocumentType.GOVERNMENT_ID,
      DocumentSide.FRONT,
    );

    client.setDocument(partner.dni, docPartner);

    expect(client.toPrimitives().partners[0].documents.length > 0).toBe(true);
  });
});
