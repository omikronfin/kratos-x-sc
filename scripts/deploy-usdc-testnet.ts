import { ethers, artifacts } from "hardhat";
import { writeFileSync } from 'fs';

async function main() {
    const isContinuousIntegration = process.env.npm_config_ci;
    const signers = await ethers.getSigners();
    const accounts = {
        contractSigner: signers[0],
    }

    const contractName = "TestUSDC"

    const contractFactory = (await ethers.getContractFactory(contractName)).connect(accounts.contractSigner);
    const contractInstance = await contractFactory.deploy();

    const data = {
        name: contractName,
        dateTime: new Date(),
        address: await contractInstance.getAddress(),
        abi: artifacts.readArtifactSync(contractName).abi,
    };

    writeFileSync(`${contractName}.json`, JSON.stringify(data), {
        flag: 'w',
    });

    if(isContinuousIntegration) {
        console.log(data.address);
    } else {
        console.log("Contract '", contractName, "' deployed to:", data.address);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
