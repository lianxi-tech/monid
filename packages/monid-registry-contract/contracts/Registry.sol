// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Registry {
  struct Record {
    address owner;
    string ddoHash;
  }

  mapping(bytes32 => Record) private didToHash;

  address private owner;

  constructor() {
    owner = msg.sender;
  }

  function setRecord(bytes32 _did, string calldata _newHash) external {
    bytes memory emptyTest = bytes(didToHash[_did].ddoHash);
    if (emptyTest.length != 0 && didToHash[_did].owner != msg.sender) {
      revert('DID registration failed. Invalid did private key.');
    }
    didToHash[_did] = Record(msg.sender, _newHash);
  }

  function getRecord(bytes32 _did) external view returns (string memory) {
    return didToHash[_did].ddoHash;
  }
}
