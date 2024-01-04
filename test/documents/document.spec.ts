import { DocumentMongoRepository } from "../../src";

describe("Document", () => {
  it("should Document", async () => {
    const docs =
      await DocumentMongoRepository.instance().findDocumentByClientId(
        "ABejarano3478215161020416",
      );

    console.log(docs);

    expect(true).toBeTruthy();
  });
});
