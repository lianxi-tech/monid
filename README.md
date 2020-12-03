# MONiD

Monorepository holding libraries to integrate the "monid" DID-method, which is an decentrailzed identity implementations based on Ethereum / IPFS.

## Contents

The [packages](./packages/) directory contains the following modules:

- [monid-registry-contract](./packages/registry-contract): Wrapper for deploying / interacting with an instance of the Monid registry Ethereum smart contract.

Both the resolver and the registry can be configured to use a custom registry contract address (the default address is the [Monid registry contract](https://rinkeby.etherscan.io/address/0x61F36Db1849bC8F21F9A41A74b4f073D09E7F160#code)\).

- [monid-did-registry](./packages/monid-did-registry): Module implementing the logic for anchoring and updating MONiD Identities using an "Registry" Ethereum smart contract and IPFS.
  Relies on the `registry-contract` module for assembling / broadcasting Ethereum transactions.

- [monid-did-resolver](./packages/monid-did-resolver): Module implementing the logic for resolving monidcom Identities using an instance of the MONiD Registry contract and IPFS.
  The module is compatible with the interface required by the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver) package.

- [monid-did-driver](./packages/monid-did-driver): `did:monid` integration for the [DIF Universal Resolver](https://github.com/decentralized-identity/universal-resolver).

## Contact

route666@live.cn
