// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;

import "./StakingHandler.sol";
import "./StakingGetters.sol";

contract StakingPackage is StakingHandlers, StakingInitPackageGetter {}
