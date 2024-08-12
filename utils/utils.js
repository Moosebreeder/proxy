const { decryptNodeResponse, encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

const sendShieldedQuery = async (provider, destination, data, value) => {
  const rpclink = hre.network.config.url
  const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data)

  const response = await provider.call({
    to: destination,
    data: encryptedData,
    value,
  })

  return await decryptNodeResponse(rpclink, response, usedEncryptedKey)
}

const readContractData = async (provider, contract, method, args) => {
  const res = await sendShieldedQuery(
    provider,
    contract.target,
    contract.interface.encodeFunctionData(method, args),
    '0'
  )

  return contract.interface.decodeFunctionResult(method, res)
}

module.exports = {sendShieldedTransaction, sendShieldedQuery, readContractData}