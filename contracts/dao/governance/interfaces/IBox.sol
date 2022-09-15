// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBox {
    // Emitted when the stored value changes
    event ValueChanged(uint256 value);

    // Stores a new value in the contract
    function store(uint256 value) external;

    // Reads the last stored value
    function retrieve() external view returns (uint256);
}
