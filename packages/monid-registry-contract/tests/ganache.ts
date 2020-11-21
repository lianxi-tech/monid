require('dotenv').config();

import { ethers } from 'ethers';
import truffle from '../truffle-config';
import RegistryContract from '../build/contracts/Registry.json';
import Ganache from 'ganache-core';
import chalk from 'chalk';

export const network = truffle.networks.mainnetFork;
export const ganacheUri = `http://${network.host}:${network.port}`;
export const networkId = network.network_id;
console.log(`Ganache URI: ${ganacheUri}. Network ID: ${networkId}`);

const privKey = process.env.PRIVATE_KEY || '';
const infuraUri = process.env.INFURA_URI || '';

export const provider = () => new ethers.providers.JsonRpcProvider(ganacheUri);
export const wallet = () => new ethers.Wallet(privKey, provider());

export async function startGanache() {
  const server = Ganache.server({
    fork: infuraUri,
    network_id: networkId,
    accounts: [{ secretKey: privKey, balance: 1e20 }],
    gasLimit: 6000000,
  });

  server.listen(network.port);
  return server;
}

// deploy testable flashloan on demand
export async function deployContracts(): Promise<string> {
  console.log(chalk.green('Deploying Registry Contract'));
  const registryFactory = new ethers.ContractFactory(RegistryContract.abi, RegistryContract.bytecode, wallet());
  const registryContract = await registryFactory.deploy();
  await registryContract.deployed();
  return registryContract.address;
}
