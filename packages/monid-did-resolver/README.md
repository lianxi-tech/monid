# @monid/did-resolver

This module encapsulates the logic required to resolve MONiD Identities using an instance of the MONiD [registry smart contract](https://github.com/lianxi-tech/monid/tree/master/packages/monid-registry-contract) and an IPFS gateway.
The exported interface is compatible with the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver) module.

## Usage examples

In combination with the [DIF DID-Resolver](https://github.com/decentralized-identity/did-resolver):

```typescript
import { getResolver } from "@monid/did-resolver";
import { Resolver } from "did-resolver";

const resolver = new Resolver(getResolver());
const didDocument = await resolver.resolve(did);
// didDocument now contains the corresponding Did Document in JSON form.
```
