// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;

interface IStakingStorage {
    function totalMAINTknShares() external view returns (uint256);

    function totalStreamShares() external view returns (uint256);

    function totalAmountOfveMAINTkn() external view returns (uint256);

    function totalAmountOfStakedMAINTkn() external view returns (uint256);

    function totalPenaltyBalance() external view returns (uint256);

    function voteLockWeight() external view returns (uint256);
}
