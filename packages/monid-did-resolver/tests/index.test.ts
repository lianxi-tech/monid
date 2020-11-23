import RegistryContract from '@monid/registry-contract';
import { IpfsStorageAgent } from '../build/ipfs';
import { getPublicProfile, getResolver } from '../build';
import { testDid, testDidDoc, testDidDocWithPublicProfile } from './testdata';
import { Resolver } from 'did-resolver';

describe('DID Resolver', () => {
  let ethereumMock: any;

  beforeEach(() => {
    ethereumMock = jest.spyOn(RegistryContract.prototype, 'resolveDID').mockResolvedValue('testHash');
    jest.spyOn(IpfsStorageAgent.prototype, 'catJSON').mockResolvedValue(testDidDoc);
  });

  describe('getResolver', () => {
    it('should resolve monid DID', async () => {
      const monidResolver = getResolver();
      const resolver = new Resolver(monidResolver);
      const didDoc = await resolver.resolve(testDid);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith('testHash');
      expect(didDoc).toEqual(testDidDoc);
    });

    it('should fail if did id string is wrong', async () => {
      // disable mock in this test
      ethereumMock.mockRestore();
      const monidResolver = getResolver();
      const resolver = new Resolver(monidResolver);
      await expect(resolver.resolve('did:monid:i.am.wrong@#$')).rejects.toThrow();
    });

    it('should return null if DID is not registered', async () => {
      ethereumMock.mockResolvedValue(undefined);
      const resolver = new Resolver(getResolver());
      await expect(resolver.resolve('')).rejects.toThrow('Missing DID');
    });
  });

  describe('getPublicProfile', () => {
    it('should test public profile resolver', async () => {
      const publicProfile = await getPublicProfile(testDidDocWithPublicProfile);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledWith('testHash');
      // public profile should be mocked return value of catJson see line #11
      expect(publicProfile).toEqual(testDidDoc);
    });

    it('should return null if no public profile is in DID Document', async () => {
      // @ts-ignore
      const publicProfile = await getPublicProfile(testDidDoc);
      expect(IpfsStorageAgent.prototype.catJSON).toBeCalledTimes(0);
      expect(publicProfile).toBe(undefined);
    });
  });
});
