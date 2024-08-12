const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners()

  const simpleContract = await hre.ethers.deployContract('SimpleContract')
  await simpleContract.waitForDeployment()
  console.log(`SimpleContract deployed to ${simpleContract.target}`)


  const proxyAdmin = await hre.ethers.deployContract('ProxyAdmin', [signer.address])
  await proxyAdmin.waitForDeployment()
  console.log(`ProxyAdmin deployed to ${proxyAdmin.target}`)

  const proxy = await hre.ethers.deployContract('ProxyImpl', [
    simpleContract.target,
    proxyAdmin.target,
    simpleContract.interface.encodeFunctionData('initialize', []),
  ])

  await proxy.waitForDeployment()
  console.log(`ProxyImpl deployed to ${proxy.target}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })