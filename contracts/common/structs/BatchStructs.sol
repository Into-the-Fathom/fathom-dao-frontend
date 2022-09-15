// Copyright SECURRENCY INC.
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

// Struct for batch transfer input
struct BatchTransferDetails {
    address to;
    uint value;
}

// Struct for batch transfer with partition input
struct BatchTransferByPartitionDetails {
    bytes32 partition;
    address to;
    uint value;
}
