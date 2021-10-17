import { IDidDocument } from '@decentralized-identity/did-common-typescript';
import RegistryContract, { SignatureLike } from '@monid/registry-contract';
import { IpfsStorageAgent } from './ipfs';
require('dotenv').config();

const MONID_PUBLIC_PROFILE_TYPE = 'MONiDPublicProfile';
export const infuraUrl = process.env.INFURA_URI || '';
export const monidRegistryContract = process.env.REGISTRY_CONTRACT_ADDRESS || '';
export const monidIpfsHost = process.env.INFURA_IPFS_URI || '';

if (infuraUrl == '') {
  console.error('must assign INFURA_URI');
  process.exit(1);
}

if (monidRegistryContract == '') {
  console.error('must assign REGISTRY_CONTRACT_ADDRESS');
  process.exit(1);
}

if (monidIpfsHost == '') {
  console.error('must assign INFURA_IPFS_URI');
  process.exit(1);
}

/**
 * Returns a configured registrar for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the smart contract state and broadcasting transactions
 * @param contractAddress - Ethereum address of a instance of the registry smart contract, to be used for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents, should allow for pinning
 */
export const getRegistry = (
  providerUrl: string = infuraUrl,
  contractAddress: string = monidRegistryContract,
  ipfsHost: string = monidIpfsHost
) => {
  const registryContract = new RegistryContract(contractAddress, providerUrl);
  const ipfs = new IpfsStorageAgent(ipfsHost);

  return {
    /**
     * Returns an unsigned, RLP encoded, serialized, Etereum TX.
     * Once the transaction is signed, it can be broadcast to the network to be
     * processed by the registry smart contract.
     *
     * @param pubKey - the public key of the future transaction signer. This is required
     * to fetch the latest corresponding Ethereum transaction nonce, and assemble a valid transaction
     * @param didDocument - the Did Document to store on IPFS
     * @returns Unsigned, hex encoded, RLP encoded contract call. Can be signed using a secp256k1 key.
     */
    async publishDidDocument(pubKey: Buffer, didDocument: IDidDocument): Promise<string> {
      const documentHash = await ipfs.storeJSON(didDocument);
      return registryContract
        .prepareAnchoringTransaction(didDocument.id, documentHash, pubKey)
        .then((txBuffer) => '0x' + txBuffer.toString('hex'));
    },

    /**
     * Given an unsigned, hex encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
     * and a {@link SignatureLike} object (containing the R, S, and V values for the corresponding signature), will
     * assemble / encode the signed transaction and broadcast it to the Ethereum network,
     * then wait for the transaction to be mined, and return the result.
     * @see https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature
     *
     * @param transactionHex - RLP encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
     * @param signature - Object containing the hex encoded values for R and S, and a 0 / 1 value vor V.
     * @returns TransactionReceipt containing the status of the TX, gas used, # of confirmations, etc.
     */
    async broadcastTransaction(transactionHex: string, signature: SignatureLike) {
      return registryContract.broadcastTransaction(transactionHex, signature);
    },

    /**
     * Given a DID and a "Public Profile" JSON object, the function will attempt to publish the Public Profile document
     * to IPFS, and return a "ServiceEndpoint" section with the corresponding IPFS hash included
     * @see https://monid-lib.readthedocs.io/en/latest/publicProfile.html
     *
     * @param did - The DID of the identity associated with the public profile
     * @param publicProfile - Document to be published to IPFS and linked in the Did Document
     *   the public profile is expected to be a JSON Signed Verifiable Credential
     *
     * @returns Service Endpoint section in JSON form, advertising the newly published document
     * The returned section can be included in a DID Document to make the public profile discoverable.
     */
    async publishPublicProfile(did: string, publicProfile: any): Promise<ReturnType<typeof generatePublicProfileServiceSection>> {
      return generatePublicProfileServiceSection(did, await ipfs.storeJSON(publicProfile));
    },
  };
};

/**
 * @internal
 * Helper function to generate a Service Endpoint entry advertising a Public Profile
 * given an IPFS hash and the DID of the owner / associated identity.
 * The returned section can be added to a DID Document to advertise
 *
 * @param did - The DID of the identity associated with the public profile
 * @param profileIpfsHash - The IPFS hash to be listed
 *   the public profile is expected to be a JSON Signed Verifiable Credential
 *
 * @returns Service Endpoint section in JSON form, advertising the newly published document
 * The returned section can be included in a DID Document to make the public profile discoverable.
 */
function generatePublicProfileServiceSection(did: string, profileIpfsHash: string) {
  return {
    id: `${did};MONiDPubProfile`,
    serviceEndpoint: `ipfs://${profileIpfsHash}`,
    description: 'Verifiable Credential describing entity profile',
    type: MONID_PUBLIC_PROFILE_TYPE,
  };
}
