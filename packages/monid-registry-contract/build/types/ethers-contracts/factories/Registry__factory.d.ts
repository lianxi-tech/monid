import { Signer } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import { ContractFactory, Overrides } from '@ethersproject/contracts';
import type { Registry } from '../Registry';
export declare class Registry__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<Registry>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): Registry;
    connect(signer: Signer): Registry__factory;
    static connect(address: string, signerOrProvider: Signer | Provider): Registry;
}
