import {
  BusinessAllie,
  BusinessAllieDTO,
  BusinessAllieMongoRepository,
  BusinessAllieStatus,
  BusinessAllieType,
  Referred,
  ReferredDTO,
  ReferredStatus,
} from "../../src";

describe("Business Allie", () => {
  it("Create a Business Allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "Business-WANER1128024080";
    const allieExist: BusinessAllieDTO =
      await businessRepo.getBusinessAllie(clientId);

    if (!allieExist) {
      const alliePayload: BusinessAllieDTO = {
        // client id
        clientId: clientId,
        name: "angel",
        email: "angel@gmail.com",
        referredBy: "string",
        status: BusinessAllieStatus.APPROVED,
        type: BusinessAllieType.ALLIE,
        createdAt: new Date(),
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      await businessRepo.saveBusinessAllie(bAllie);

      return;
    }

    console.log("allie already exists");
  });

  it("Should add opportunity to allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "Business-WANER1128024080";
    const allieExist: BusinessAllieDTO =
      await businessRepo.getBusinessAllie(clientId);
    const referredClientId = "MSerrano181263254";

    if (!allieExist) {
      console.log("error");
    }

    const opportunityExist: Referred =
      await businessRepo.getReferredByClientId(referredClientId);

    console.log("opportunityExist", opportunityExist);

    if (!opportunityExist) {
      const referredPayload: ReferredDTO = {
        taxId: " 2 ",
        name: "CC",
        email: "c@email.com;",
        feeSwap: 0.5,
        status: ReferredStatus.REFERRED_REGISTERED_BY_ALLIE,
        referredByClientId: clientId,
        clientId: referredClientId,
        createdAt: new Date(),
      };

      await businessRepo.addReferredToAllie(clientId, referredPayload);
    }
  });

  it("Should create a marketer allie", () => {});
  it("Should add referred to a marketer allie", () => {});
});
