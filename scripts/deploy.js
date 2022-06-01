const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

async function main() {
  //substitute for contract name
  const contractName = "BetaTest"
  
  const ERC721Contract = await ethers.getContractFactory(contractName);

  const nftContract = await upgrades.deployProxy(ERC721Contract,[]);

  await nftContract.deployed();

  const addresses = {
      proxy: nftContract.address,
      admin: await upgrades.erc1967.getAdminAddress(nftContract.address), 
      implementation: await upgrades.erc1967.getImplementationAddress(
        nftContract.address)
  };
  console.log('Addresses:', addresses);
  try { 
    await run('verify', { address: addresses.implementation });
  } catch (e) {
    console.log(e)
  }

  fs.writeFileSync('deployment-addresses.json', JSON.stringify(addresses));
}

main();