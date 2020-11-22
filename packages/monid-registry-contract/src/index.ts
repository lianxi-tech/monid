import { ethers, UnsignedTransaction, utils } from 'ethers';
import { Registry__factory as RegistryFactory } from '../types/ethers-contracts/factories/Registry__factory';
import type { Registry } from '../types/ethers-contracts/Registry';
import { Utils } from './utils';

export type SignatureLike = {
  r: string;
  s: string;
  recoveryParam?: number;
};

export default class RegistryContract {
  private readonly provider: ethers.providers.Provider;
  private readonly contract: Registry;

  constructor(address: string, providerUri: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUri);
    this.contract = RegistryFactory.connect(address, this.provider);
  }

  /**
   * Resolves a DID on the MONiD Registry Contract. Checks if an entry for this DID exists and returns the related
   * IPFS hash if so.
   * @see https://docs.ethers.io/v5/getting-started/#getting-started--signing
   *
   * @param did -  the DID that should be resolved
   * @returns The IPFS hash if an entry exists for the given DID
   * @throws if the DID does not have a "monid" method identifier or if no Did Document was found
   * @example registryContract.resolveDID("did:monid:91abd7ecf8cc9c60e387b64a61996da07d874981922d26bc6c9531ace467afd1")
   */
  async resolveDID(did: string): Promise<string> {
    const idString = Utils.stripMethodPrefix(did);
    return await this.contract.getRecord(idString);
  }

  /**
   * Given an unsigned, hex encoded Ethereum transaction
   * and a {@link SignatureLike} object (containing the R, S, and V values for the corresponding signature), will
   * assemble / encode the signed transaction and broadcast it to the Ethereum network,
   * then wait for the transaction to be mined, and return the result.
   * @see https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature
   *
   * @param tx - hex encoded RLP encoded Ethereum transaction (e.g. as created by `prepareAnchoringTransaction`)
   * @param sig - Object containing the hex encoded values for R and S, and a 0 / 1 value vor V.
   *
   * @returns TransactionReceipt containing the status of the TX, gas used, # of confirmations, etc.
   */
  async broadcastTransaction(tx: string, sig: SignatureLike) {
    if (sig.r.length !== 66) {
      throw new Error(`Invalid R length, expected 32 bytes, got ${sig.r.length}`);
    }

    if (sig.s.length !== 66) {
      throw new Error(`Invalid S length, expected 32 bytes, got ${sig.s.length}`);
    }

    if (sig.recoveryParam !== 0 && sig.recoveryParam !== 1) {
      throw new Error(`Invalid recovery param, expected 0 or 1, got ${sig.recoveryParam}`);
    }

    return this.provider.sendTransaction(utils.serializeTransaction(utils.parseTransaction(tx), sig)).then((tx) => tx.wait());
  }

  /**
   * Returns an unsigned, RLP encoded, serialized, Etereum TX.
   * Once the transaction is signed, the RegistryContract.broadcastTransaction
   * method can be called to update the entry in the registry smart contract.
   *
   * @param did - the DID to be anchored, e.g. did:monid:91abd7ecf8cc9c60e387b64a61996da07d874981922d26bc6c9531ace467afd1
   * @param hash - the IPFS hash for the corresponding DID Document
   * @param pubKey - the public key of the intended signer. It is used to fetch the latest nonce (for
   * the associated Ethereum dddress) and encode it in the TX
   * @param gasConfiguration - optional configuration for the gasPrice and gasLimit to be encoded in the TX
   *
   * @returns Buffer containing an unsigned RLP encoded call to the `update` function on the registry smart contract.
   */
  async prepareAnchoringTransaction(
    did: string,
    hash: string,
    pubKey: Buffer,
    { gasPrice, gasLimit } = {
      gasPrice: Utils.decimalToHex(21000000000),
      gasLimit: Utils.decimalToHex(300000),
    }
  ): Promise<Buffer> {
    const idString = Utils.stripMethodPrefix(did);
    const nonce = await this.provider.getTransactionCount(utils.computeAddress(pubKey));
    return this.contract.populateTransaction
      .setRecord(idString, hash, {
        nonce,
        gasLimit,
        gasPrice,
      })
      .then((tx) => Buffer.from(utils.serializeTransaction(tx).slice(2), 'hex'));
  }

  /**
   * Given a raw unsigned ethereum TX, and a signature object (including R, S, and the recovery value),
   * will encode the signature correctly and use 'this.provider' to send the TX to the network.
   */
  async sendRawTransaction(
    txData:
      | string
      | {
          unsignedTx: UnsignedTransaction;
          signature: SignatureLike;
        }
  ) {
    if (typeof txData === 'string') {
      return this.provider.sendTransaction(txData);
    }
    return this.provider.sendTransaction(utils.serializeTransaction(txData.unsignedTx, txData.signature)).then((res) => res.wait());
  }
}
