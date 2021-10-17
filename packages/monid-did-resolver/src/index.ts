import { DIDDocument, ParsedDID, Resolver } from 'did-resolver';
import RegistryContract from '@monid/registry-contract';
import { IpfsStorageAgent } from './ipfs';
require('dotenv').config();

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
 * Returns a configured resolver for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the registry contract state and broadcasting transactions
 * @param contractAddress - The Ethereum address of a instance of the registry smart contract to use for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents
 */
export function getResolver(
  providerUri: string = infuraUrl,
  contractAddress: string = monidRegistryContract,
  ipfsHost: string = monidIpfsHost
) {
  const registryContract = new RegistryContract(contractAddress, providerUri);
  const ipfsAgent = new IpfsStorageAgent(ipfsHost);

  /**
   * Given a `monid` DID, will attempt to fetch the corresponding DID Document according to the (`did:monid` method specification).
   * @param did - the did to resolve
   * @param parsed - a object containing the parsed DID, as provided by the "did-resolver" module
   * @param didResolver - instance of {@link Resolver}, populated by the "did-resolver" module
   * @returns DID Document - Did Document for the corresponding DID in JSON form
   */
  async function resolve(did: string, parsed: ParsedDID, didResolver: Resolver): Promise<DIDDocument> {
    const ipfsHash = await registryContract.resolveDID(did);
    if (ipfsHash) {
      return (await ipfsAgent.catJSON(ipfsHash)) as DIDDocument;
    }

    return {
      '@context': 'https://w3id.org/did/v1',
      id: '',
      publicKey: [],
    };
  }

  return { monid: resolve };
}

/**
 * Given a Did Document for a `monid` identity and a link to an IPFS HTTP gateway, the function will attempt
 * to fetch the Public Profile listed in the `ServiceEndpoint` section if one is present.
 * @see https://monid-lib.readthedocs.io/en/latest/publicProfile.html
 *
 * @param didDoc - JSON Did Document potentially containing a MONiD public profile serviceEndpoint section
 * @param ipfsHost - A public IPFS gateway which can be used to retrieve the public profile signed credential
 * @returns SignedCredential - A public profile signed credential encoding some general info about the identity
 * if one is present in the Did Document
 */
export async function getPublicProfile(didDoc: DIDDocument, ipfsHost: string = monidIpfsHost): Promise<any | null> {
  const ipfsAgent = new IpfsStorageAgent(ipfsHost);
  const publicProfileSection = didDoc?.service?.find((endpoint) => endpoint.type === 'MONiDPublicProfile');
  if (publicProfileSection?.serviceEndpoint) {
    const hash = publicProfileSection.serviceEndpoint.replace('ipfs://', '');
    return ipfsAgent.catJSON(hash);
  }
}
