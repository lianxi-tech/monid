/// <reference types="node" />
import { ethers, UnsignedTransaction } from 'ethers';
export declare type SignatureLike = {
  r: string;
  s: string;
  recoveryParam?: number;
};
export default class RegistryContract {
  private readonly provider;
  private readonly contract;
  constructor(address: string, providerUri: string);
  /**
   * Resolves a DID on the MONiD Registry Contract. Checks if an entry for this DID exists and returns the related
   * IPFS hash if so.
   * @see https://docs.ethers.io/v5/getting-started/#getting-started--signing
   *
   * @param did -  the DID that should be resolved
   * @returns The IPFS hash if an entry exists for the given DID
   * @throws if the DID does not have a "monid" method identifier or if no Did Document was found
   * @example registryContract.resolveDID("did:monid:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2")
   */
  resolveDID(did: string): Promise<string>;
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
  broadcastTransaction(tx: string, sig: SignatureLike): Promise<ethers.providers.TransactionReceipt>;
  /**
   * Returns an unsigned, RLP encoded, serialized, Etereum TX.
   * Once the transaction is signed, the RegistryContract.broadcastTransaction
   * method can be called to update the entry in the registry smart contract.
   *
   * @param did - the DID to be anchored, e.g. did:monid:accf...eed
   * @param hash - the IPFS hash for the corresponding DID Document
   * @param pubKey - the public key of the intended signer. It is used to fetch the latest nonce (for
   * the associated Ethereum dddress) and encode it in the TX
   * @param gasConfiguration - optional configuration for the gasPrice and gasLimit to be encoded in the TX
   *
   * @returns Buffer containing an unsigned RLP encoded call to the `update` function on the registry smart contract.
   */
  prepareAnchoringTransaction(
    did: string,
    hash: string,
    pubKey: Buffer,
    {
      gasPrice,
      gasLimit,
    }?: {
      gasPrice: string;
      gasLimit: string;
    }
  ): Promise<Buffer>;
  /**
   * Given a raw unsigned ethereum TX, and a signature object (including R, S, and the recovery value),
   * will encode the signature correctly and use 'this.provider' to send the TX to the network.
   */
  sendRawTransaction(
    txData:
      | string
      | {
          unsignedTx: UnsignedTransaction;
          signature: SignatureLike;
        }
  ): Promise<ethers.providers.TransactionResponse | ethers.providers.TransactionReceipt>;
}
