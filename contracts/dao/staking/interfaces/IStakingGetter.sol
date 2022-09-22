// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;

import "../StakingStructs.sol";

interface IStakingGetter {
    function getLatestRewardsPerShare(uint256 streamId) external view returns (uint256);

    function getLockInfo(address account, uint256 lockId) external view returns (LockedBalance memory);

    function getUsersPendingRewards(address account, uint256 streamId) external view returns (uint256);

    function getPending(uint256 streamId, address account) 
        external
        view
        returns (uint256);


    function getAllLocks(address account)  external view  returns (LockedBalance[] memory);
    
}
