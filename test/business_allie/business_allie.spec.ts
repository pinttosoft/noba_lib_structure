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
    const clientId: string = "ABejarano187263254";
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
    }
  });

  it("Should add opportunity to allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "ABejarano187263254";
    const allieExist: BusinessAllieDTO =
      await businessRepo.getBusinessAllie(clientId);
    const opportunityClientId = "FSilva187263254";

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
    }

    const opportunityExist: Referred =
      await businessRepo.getOpportunityByClientId(opportunityClientId);

    if (!opportunityExist) {
      const opportuntyPayload: ReferredDTO = {
        taxId: "  ",
        name: "Felipe Silva",
        email: "some@email.com;",
        feeSwap: 0.5,
        status: ReferredStatus.OPPORTUNITY_WITH_ACTIVE_ACCOUNT,
        referredByClientId: clientId,
        clientId: opportunityClientId,
        createdAt: new Date(),
      };

      await businessRepo.addOpportunityToAllie(clientId, opportuntyPayload);
    }
  });
});
