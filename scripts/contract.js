const Web3 = require('web3');
const { ethers, BigNumber } = require("ethers");
const BN = require('bn.js');
const contract_abi = require('../artifacts/contracts/BetaTest.sol/BetaTest.json')

async function main() {
  HMY_TESTNET_RPC_URL = 'https://api.s0.b.hmny.io';
  const account1 = '0x3868d285618A5B36083b555177D5E76141AaCCb4'
  const account1Secret = '7f3177c29c485d3a8c7a0ae82e271258ceaa30b70639014eb90b1168af66692e'
  const address = '0x82088D79BAF315A5A145559087083dD16fFD96Be'
  const abi = contract_abi['abi']
  // ethers.js
  // parse function
  const ETHER_fromWei = (num) => ethers.utils.formatEther(num)
  const ETHER_toWei = (num) => ethers.utils.parseEther(num)
  let provider = new ethers.providers.JsonRpcProvider(HMY_TESTNET_RPC_URL)
  // const signer = provider.getSigner(account1)
  const signer = new ethers.Wallet(account1Secret, provider)
  const contract = new ethers.Contract(address, abi, signer)
  // get contract basic info
  const contractInfo = async () => {
    const Balance = ETHER_fromWei(await provider.getBalance(account1))
    const Name = await contract.name()
    const Symbol = await contract.symbol()
    const Owner = await contract.owner()
    const TotalSupply = await contract.totalSupply()
    const Price = await contract.PRICE()
    const BaseTokenUri = await contract.baseTokenURI()
    console.log(`Balance: ${Balance} ONE`)
    console.log(`Name: ${Name}`)
    console.log(`Symbol: ${Symbol}`)
    console.log(`Owner: ${Owner}`)
    console.log(`TotalSupply: ${TotalSupply}`)
    console.log(`Price: ${Price}`)
    console.log(`BaseTokenUri: ${BaseTokenUri}`)
  }
  // mint NFT
  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await connection.safeMint(to=addr, quantity_=1,{ gasLimit: 1000000, value: ethers.utils.parseEther((0.000001).toString()) })
    console.log('Mining....', result.hash)
    let receipt = await result.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`)
    console.log(`Gas used: ${receipt.gasUsed.toString()}`)
    const nftBalance = await contract.balanceOf(addr)
    console.log(`NFT balance: ${nftBalance}`)
  }

  // web3.js
  // parse function
  const WEB3fromWei = (num) => web3.utils.fromWei(num)
  const WEB3_toWei = (num) => web3.utils.toWei(num)
  const web3 = new Web3(HMY_TESTNET_RPC_URL)
  const token = new web3.eth.Contract(abi, address)
  // Retrieve accounts
  let hmyMasterAccount = web3.eth.accounts.privateKeyToAccount(account1Secret)
  web3.eth.accounts.wallet.add(hmyMasterAccount)
  web3.eth.defaultAccount = hmyMasterAccount.address
  const myAddress = web3.eth.defaultAccount
  console.log('My address: ', myAddress)
  // contract info
  const web3_contractInfo = async () => {
    const name = await token.methods.name().call()
    const symbol = await token.methods.symbol().call()
    const owner = await token.methods.owner().call()
    const totalSupply = await token.methods.totalSupply().call()
    const price = await token.methods.PRICE().call()
    const isLocked = await token.methods.isLocked().call()
    const baseTokenUri = await token.methods.baseTokenURI().call()
    const ownerBalance = await web3.eth.getBalance(account1)
    console.log(`NAME: ${name}`)
    console.log(`SYMBOL: ${symbol}`)
    console.log(`OWNER: ${owner}`)
    console.log(`TOTAL SUPPLY: ${totalSupply}`)
    console.log(`PRICE: ${price}`)
    console.log(`IS LOCKED: ${isLocked}`)
    console.log(`BASETOKENURI: ${baseTokenUri}`)
    console.log(`OWNER BALANCE: ${WEB3fromWei(ownerBalance.toString())} ONE`)
  }
  // mint NFT
  const mintNFT = async () => {
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); //get latest nonce
    const tx = {
      'from': myAddress,
      'to': address,
      "value": 230000000000000,
      'nonce': nonce,
      'gas': 500000,
      'data': token.methods.safeMint("0xa3F592D1732b44C5adf34827BA9634a9aa5E679e", 1).encodeABI()
    }
    const signPromise = web3.eth.accounts.signTransaction(tx, account1Secret)
    signPromise.then(async (signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The hash of your transaction is: ", hash); 
        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise failed:", err)
    })
  }

  // lock transfer
  const lockTransfer = async () => {
    const res = await token.methods.setLocked(true).send({from: myAddress, gas: 500000})
    console.log(res)
  }
  // Call the mintNFT function
  // await mintNFT()
  await web3_contractInfo()
  // await lockTransfer()
}

main()