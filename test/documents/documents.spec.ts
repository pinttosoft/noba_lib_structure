import {
  ApplicationDocumentError,
  NobaDocumentTypeConverter,
  StorageAWS,
} from "../../src";

describe("Docs", () => {
  it("test ", async () => {
    const nobaDocs: any = [
      {
        documentId: "56fb92e1-6536-41c5-950a-aa0a2f71e298",
        patch: "2023/11/f94915a1-3ee1-4f3d-a48b-a8c5fa5fa480.jpg",
        documentType: "drivers_license",
        documentSide: "front",
      },
      {
        documentId: "df7d80a9-c3ae-4ec4-8505-cacb472a55a4",
        patch: "2023/11/626d9666-de07-4ce1-a5ba-0c160225afa8.jpg",
        documentType: "drivers_license",
        documentSide: "back",
      },
      {
        documentId: "ff569086-546d-42fd-b1f5-39ba044e7f1f",
        patch: "2023/11/36586530-d39c-4e10-a6ce-bbd5c87317a6.png",
        documentType: "property_tax_bill",
        documentSide: "front",
      },
    ];

    const layer2Documents = [
      {
        document_id: "2de5b18c-f666-493e-b48a-dc7692e2f9ce",
        status: "MISSING",
        document: "ACCOUNT_AGREEMENT",
      },
      {
        document_id: "38130f30-00e7-4980-af78-c11817082050",
        status: "SUBMITTED",
        document: "DRIVERS_LICENCE_BACK",
      },
      {
        document_id: "a6459b75-fe69-48b1-9959-f31e23a0ab5d",
        status: "SUBMITTED",
        document: "DRIVERS_LICENCE_FRONT",
      },
      {
        document_id: "ea6abd3d-a1d5-4a86-a776-a8dd605214a2",
        status: "MISSING",
        document: "LAYER2_ACCOUNT_AGREEMENT",
      },
      {
        document_id: "f8546c0b-4774-41bc-91ea-7dec66a11b7d",
        status: "MISSING",
        document: "PASSPORT",
      },
    ];

    const allDocs = nobaDocs.map(async (nobaDoc): Promise<void> => {
      // console.log("nobaDoc", nobaDoc, nobaDoc.documentSide.toUpperCase());
      const layer2DocConverted: string =
        NobaDocumentTypeConverter.convertNobaToThirdParty(
          nobaDoc.documentType,
          nobaDoc.documentSide.toUpperCase(),
          // nobaDoc.documentSide.toUpperCase(),
        );

      console.log("layer2DocConverted", layer2DocConverted);

      // if not null doc does exist in layer2(layer2 needs passport or driver license
      if (layer2DocConverted) {
        const layer2Doc: ApplicationDocumentError = getLayer2Document(
          layer2Documents,
          layer2DocConverted,
        );
        // console.log("!!! layer2Doc", layer2Doc);
        // call UploadDocumentToLayer2
        // const layer2DocResponse = await new UploadDocumentToLayer2(
        //   this.storageService,
        //   this.apiDocumentService
        // ).run(nobaDoc.patch, layer2Doc.document_id);

        // console.log("layer2DocResponse", layer2DocResponse);
      }
    });
  });

  it("Test aws storage download", async () => {
    //
    const aws = await StorageAWS.instance("clients-document");
    try {
      const url = await aws.downloadFile(
        "0226e0f4-695e-4232-add8-7e481a724e5b.png",
      );
    } catch (e) {
      console.error("e");
      console.error(e);
    }

    // console.log("url", url);
  });

  const getLayer2Document = (layer2Documents: any, layer2DocType: string) => {
    return layer2Documents.find((layer2Doc: ApplicationDocumentError) => {
      return layer2Doc.document === layer2DocType;
    });
  };
});
