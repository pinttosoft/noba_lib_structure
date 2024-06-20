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
import { DiffusionChannels } from "../../src/business_allie_program/enums/diffussion_channels.enum";
import { FeeLimitsType } from "../../src/business_allie_program/type/fee_limits.type";

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
        name: "waner",
        email: "waner@gmail.com",
        referredBy: "string",
        status: BusinessAllieStatus.APPROVED,
        type: BusinessAllieType.ALLIE,
        createdAt: new Date(),
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      await businessRepo.upsertBusinessAllie(bAllie);

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

    const referredExist: Referred =
      await businessRepo.getReferredByClientId(referredClientId);

    console.log("referredExist", referredExist);

    if (!referredExist) {
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

  it("Should create a marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "JLanza15781342";
    const allieExist: BusinessAllieDTO =
      await businessRepo.getBusinessAllie(clientId);

    if (!allieExist) {
      const alliePayload: BusinessAllieDTO = {
        clientId: clientId,
        name: "johana",
        diffusionChanel: DiffusionChannels.FACEBOOK,
        link: "facebook.com/johana",
        email: "johana@gmail.com",
        referredBy: "string",
        status: BusinessAllieStatus.APPROVED,
        type: BusinessAllieType.MARKETER,
        createdAt: new Date(),
      };

      const bAllie: BusinessAllie = new BusinessAllie(alliePayload);
      await businessRepo.upsertBusinessAllie(bAllie);

      return;
    }

    console.log("allie already exists");
  });

  it("Should delete marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    await businessRepo.deleteBusinessAllie(clientId);
  });

  it("Should edit marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId: string = "JLanza15781342";
    const allieExist: BusinessAllieDTO =
      await businessRepo.getBusinessAllie(clientId);

    const allie: BusinessAllie = new BusinessAllie(allieExist);
    allie.updateStatus(BusinessAllieStatus.DENIED);

    const feeLimits: FeeLimitsType = {
      min: 0.2,
      max: 6,
    };

    allie.updateFeeLimits(feeLimits);
    console.log("allie to primitives", allie.toPrimitives());

    await businessRepo.upsertBusinessAllie(allie);
  });

  it("Should add referred to a marketer allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    const referredPayload: ReferredDTO = {
      clientId: "12345",
      taxId: "3third_reffered_johana",
      name: "amigo de johana 3",
      email: "amigo_johana3@email.com",
      feeSwap: 2,
      status: ReferredStatus.REFERRED_WITH_ACTIVE_ACCOUNT,
      referredByClientId: clientId,
      createdAt: new Date(),
    };

    await businessRepo.addReferredToAllie(clientId, referredPayload);
  });

  it("Should edit referred of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";
    const referredTaxId = "1st_reffered_johana";

    const referred: Referred =
      await businessRepo.getReferredByTaxId(referredTaxId);
    console.log("referred", referred);
    referred.setStatus(ReferredStatus.REFERRED_WITH_ACTIVE_ACCOUNT);
    referred.setFeeSwap(0.3);

    await businessRepo.updateReferredData(referred);
  });

  it("Should delete referred of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";
    const referredClientId = "1234";

    console.log(
      "1st referrals",
      await businessRepo.getReferralsByClientId(clientId),
    );

    await businessRepo.deleteReferred(clientId, referredClientId);

    console.log(
      "2nd referrals",
      await businessRepo.getReferralsByClientId(clientId),
    );
  });

  it("Should list referrals of allie", async () => {
    const businessRepo: BusinessAllieMongoRepository =
      BusinessAllieMongoRepository.instance();
    const clientId = "JLanza15781342";

    const referrals = await businessRepo.getReferralsByClientId(clientId);

    console.log("referrals", referrals);
  });
});
