const hre = require("hardhat");
const utils = require("../utils/utils.js")

async function main() {

  const proxyAddress = "0xE82c126F7bC5Bbc850c2bCFDB5E0132EEc407072";
  const proxyAdminAddress = "0xcD316B5e90dbf51Bf706dad8070C86dA065aeDD7";
  const [signer] = await hre.ethers.getSigners()

  const proxy = await hre.ethers.getContractAt('ProxyImpl', proxyAddress)
  const proxyAdmin = await hre.ethers.getContractAt('ProxyAdmin', proxyAdminAddress)

  const simpleContractV2 = await hre.ethers.deployContract('SimpleContractV2')
  await simpleContractV2.waitForDeployment()
  console.log(`SimpleContractV2 deployed to ${simpleContractV2.target}`)


  const upgrade = await utils.sendShieldedTransaction(
    signer,
    proxyAdmin.target,
    proxyAdmin.interface.encodeFunctionData('upgradeTo', [
      proxy.target,
      simpleContractV2.target,
    ]),
    '0'
  )

  const upgradeTx = await upgrade.wait()
  console.log(`SimpleContract version updated to V2, hash : ${upgradeTx.hash}`)

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})