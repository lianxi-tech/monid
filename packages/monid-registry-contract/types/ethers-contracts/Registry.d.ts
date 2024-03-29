/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from 'ethers';
import { Contract, ContractTransaction, Overrides, CallOverrides } from '@ethersproject/contracts';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';

interface RegistryInterface extends ethers.utils.Interface {
  functions: {
    'setRecord(bytes32,string)': FunctionFragment;
    'getRecord(bytes32)': FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'setRecord', values: [BytesLike, string]): string;
  encodeFunctionData(functionFragment: 'getRecord', values: [BytesLike]): string;

  decodeFunctionResult(functionFragment: 'setRecord', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getRecord', data: BytesLike): Result;

  events: {};
}

export class Registry extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: RegistryInterface;

  functions: {
    setRecord(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<ContractTransaction>;

    'setRecord(bytes32,string)'(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<ContractTransaction>;

    getRecord(
      _did: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    'getRecord(bytes32)'(
      _did: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;
  };

  setRecord(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<ContractTransaction>;

  'setRecord(bytes32,string)'(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<ContractTransaction>;

  getRecord(_did: BytesLike, overrides?: CallOverrides): Promise<string>;

  'getRecord(bytes32)'(_did: BytesLike, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    setRecord(_did: BytesLike, _newHash: string, overrides?: CallOverrides): Promise<void>;

    'setRecord(bytes32,string)'(_did: BytesLike, _newHash: string, overrides?: CallOverrides): Promise<void>;

    getRecord(_did: BytesLike, overrides?: CallOverrides): Promise<string>;

    'getRecord(bytes32)'(_did: BytesLike, overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    setRecord(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<BigNumber>;

    'setRecord(bytes32,string)'(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<BigNumber>;

    getRecord(_did: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    'getRecord(bytes32)'(_did: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    setRecord(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    'setRecord(bytes32,string)'(_did: BytesLike, _newHash: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    getRecord(_did: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    'getRecord(bytes32)'(_did: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
