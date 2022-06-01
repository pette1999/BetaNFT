const { ethers, upgrades, run } = require('hardhat');
const fs = require('fs');

async function main () {
    const Beta = await ethers.getContractFactory('BetaTest');
    console.log('Upgrading...');
    let addresses = JSON.parse(fs.readFileSync('deployment-addresses.json'));
    await upgrades.upgradeProxy(addresses.proxy, Beta);
    console.log('Upgraded');

    addresses = {
        proxy: addresses.proxy,
        admin: await upgrades.erc1967.getAdminAddress(addresses.proxy), 
        implementation: await upgrades.erc1967.getImplementationAddress(
            addresses.proxy)
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