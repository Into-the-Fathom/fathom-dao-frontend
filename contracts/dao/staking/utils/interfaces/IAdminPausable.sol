// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;

interface IAdminPausable {
    function adminPause(uint256 flags) external;
}
