#!/usr/bin/env bash
network=$1

echo "Network: $network"

truffle migrate --reset --network $network

# Verify Contracts on Etherscan
truffle run verify Registry --network $network --license SPDX-License-Identifier