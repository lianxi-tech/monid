import RegistryContract from '@monid/registry-contract';
import { getRegistry } from '../build';
import { IpfsStorageAgent } from '../build/ipfs';
import { didDocument, mockSignature, publicKey, publicProfile, testEncodedUnsignedTx } from './testdata';

describe('DID Registry', () => {
  let contractMock: any, ipfsMock: any;
  let registry: ReturnType<typeof getRegistry>;

  beforeAll(() => {
    registry = getRegistry();
  });

  beforeEach(() => {
    contractMock = jest
      .spyOn(RegistryContract.prototype, 'broadcastTransaction')
      //@ts-ignore Stubbed return type is not a valid Transaction TS Type
      .mockResolvedValue({ from: '', data: '', status: 1 });
    ipfsMock = jest.spyOn(IpfsStorageAgent.prototype, 'storeJSON').mockResolvedValue('QwsZ');
  });

  it('Should correctly assemble, and broadcast transaction', async () => {
    const tx = await registry.publishDidDocument(Buffer.from(publicKey.slice(2), 'hex'), didDocument);
    await registry.broadcastTransaction(tx, mockSignature);
    expect(contractMock).toHaveBeenLastCalledWith(testEncodedUnsignedTx, mockSignature);
    expect(ipfsMock).toHaveBeenLastCalledWith(didDocument);
  });

  it('should add public profile to DID doc', async () => {
    const publicProfileSection = await registry.publishPublicProfile(didDocument.id, publicProfile);
    const tx = await registry.publishDidDocument(Buffer.from(publicKey.slice(2), 'hex'), didDocument);
    await registry.broadcastTransaction(tx, mockSignature);

    expect(publicProfileSection).toStrictEqual({
      description: 'Verifiable Credential describing entity profile',
      id: 'did:monid:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc;MONiDPubProfile',
      serviceEndpoint: 'ipfs://QwsZ',
      type: 'MONiDPublicProfile',
    });
    expect(ipfsMock).toHaveBeenNthCalledWith(1, publicProfile);
    expect(ipfsMock).toHaveBeenNthCalledWith(2, didDocument);
    expect(contractMock).toHaveBeenLastCalledWith(tx, mockSignature);
  });
});
