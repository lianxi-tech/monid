require('dotenv').config();

import chalk from 'chalk';
import { ethers, Wallet } from 'ethers';
import { startGanache, wallet, provider, deployContracts, ganacheUri } from './ganache';
import Ganache from 'ganache-core';
import RegistryContract from '../build/src';
import data from './data';
import { parseTransaction } from 'ethers/lib/utils';

jest.setTimeout(30000);

describe('Test flashloan', () => {
  let account: string;
  let ganacheServer: Ganache.Server;
  let contractAddress: string;
  let registryContract: RegistryContract;

  beforeAll(async (done) => {
    ganacheServer = await startGanache();
    contractAddress = await deployContracts();
    registryContract = new RegistryContract(contractAddress, ganacheUri);
    account = wallet().address;
    console.log(`account address is ${account}`);
    done();
  });

  afterAll(async (done) => {
    ganacheServer.close();
    console.log(chalk.green('Test completed'));
    done();
  });

  test('Account should be initialized', async (done) => {
    expect(account).not.toBe(undefined);
    expect(account).not.toBe('');
    const balance = ethers.utils.formatEther(await provider().getBalance(account));
    console.log(`Account balance (ETH): ${balance}`);
    done();
  });

  it('Should return empty string if no record exists', async () => {
    const hash = await registryContract.resolveDID(data.testUserDID);
    expect(hash).toBe('');
  });

  it("Should correctly register a user's DDO hash", async () => {
    const privateKey = wallet().privateKey;
    const tx = await registryContract.prepareAnchoringTransaction(
      data.testUserDID,
      data.mockDDOHash,
      Buffer.from(new Wallet(privateKey).publicKey.slice(2), 'hex')
    );

    const rawTx = await new Wallet(privateKey).signTransaction(parseTransaction(tx));
    await registryContract.sendRawTransaction(rawTx);
    return expect(await registryContract.resolveDID(data.testUserDID)).toEqual(data.mockDDOHash);
  });

  it('Should return error in case writing record fails', async () => {
    const privateKey = Buffer.from(data.privateKey, 'hex');
    const tx = await registryContract.prepareAnchoringTransaction(
      data.testUserDID,
      data.mockDDOHash,
      Buffer.from(new Wallet(privateKey).publicKey.slice(2), 'hex')
    );
    const rawTx = await new Wallet(privateKey).signTransaction(parseTransaction(tx));
    return expect(registryContract.sendRawTransaction(rawTx)).rejects.toBeInstanceOf(Error);
  });

  it("Should correctly query contract for the user's DDO hash", async () => {
    const hash = await registryContract.resolveDID(data.testUserDID);
    expect(hash).toEqual(data.mockDDOHash);
  });

  it('Should return error in case reading record fails', async () => {
    return expect(registryContract.resolveDID('did:monid:i.dont.exist')).rejects.toBeInstanceOf(Error);
  });

  it('Should reject if no monid DID is used', async () => {
    const uportDID = 'did:ethr:test';
    expect(
      registryContract.prepareAnchoringTransaction(
        uportDID,
        data.mockDDOHash,
        Buffer.from(new Wallet(wallet().privateKey).publicKey.slice(2), 'hex')
      )
    ).rejects.toBe('Only "monid" DIDs are allowed');
    expect(registryContract.resolveDID(uportDID)).rejects.toBe('Only "monid" DIDs are allowed');
  });
});
