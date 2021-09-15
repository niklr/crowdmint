import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { getAddress } from "ethers/lib/utils";
import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { Signers } from "../types";
import { getOverrideOptions } from "../utils";
import { SimpleStorage } from "../../typechain/SimpleStorage";
import { expect } from "chai";

const { deployContract } = hre.waffle;

describe("Unit tests", function() {
  before(async function() {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    // this.signers.owner = signers[1];
    // this.signers.deployer = signers[2];
    // this.signers.alice = signers[3];

    // deploy SimpleStorage
    const simpleStorageArtifact: Artifact = await hre.artifacts.readArtifact("SimpleStorage");
    this.simpleStorage = <SimpleStorage>(
      await deployContract(this.signers.admin, simpleStorageArtifact, [], getOverrideOptions())
    );
  });

  describe("SimpleStorage", function() {
    it('should get the value', async function() {
      const actualValue = await this.simpleStorage.get();
      expect(actualValue).to.be.eq('123');
    })
  });
});
