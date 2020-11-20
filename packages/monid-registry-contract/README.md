# MONiD Registry Contract

The repository contains the source code for the Ethereum smart contract used as part of our `did:monid` [method spec](../monid-did-method-specification.md) implementation. The project also includes a configured [truffle](https://github.com/trufflesuite/truffle) environment for compiling, testing and deploying the contract, and a wrapper class allowing for easier integration.

_This is a lower level module used by the monid-did-registry ([integration](https://github.com/lianxi-tech/monid/blob/master/packages/monid-did-registry/ts/index.ts#L11)) and monid-did-resolver ([integration](https://github.com/lianxi-tech/monid-did-method/blob/master/packages/monid-did-resolver/ts/index.ts#L10)) packages to offer a more consumable API._
