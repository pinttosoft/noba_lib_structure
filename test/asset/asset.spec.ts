import { AssetMongoRepository } from "../../src";

describe("Assets", () => {
  it("Get PAB asset", async () => {
    const assetRepo = AssetMongoRepository.instance();
    const pab = await assetRepo.findAssetByCode("PAB");
    console.log("pab", pab);
  });
});
