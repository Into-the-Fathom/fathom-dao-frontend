// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;
import "../StakingStorage.sol";
import "../interfaces/IStakingGetter.sol";
import "./StakingInternals.sol";
import "../../../../node_modules/hardhat/console.sol";

contract StakingInitPackageGetter is StakingStorage, IStakingGetter, StakingInternals {
    function getLatestRewardsPerShare(uint256 streamId) external view override returns (uint256) {
        return _getLatestRewardsPerShare(streamId);
    }

    function getLockInfo(address account, uint256 lockId) external view override returns (LockedBalance memory) {
        require(lockId <= locks[account].length, "out of index");
        return locks[account][lockId - 1];
    }

    function getUsersPendingRewards(address account, uint256 streamId) external view override returns (uint256) {
        return users[account].pendings[streamId];
    }

    function getAllLocks(address account)  external view override returns (LockedBalance[] memory) {
        return locks[account];
    }

    function getStreamClaimableAmountPerLock(uint256 streamId, address account, uint256 lockId)
        external
        view
        returns (uint256) 
    {
        require(lockId <= locks[account].length, "out of index");
        uint256 latestRps = _getLatestRewardsPerShare(streamId);
        User storage userAccount = users[account];
        LockedBalance storage lock = locks[account][lockId-1];
        uint256 userRpsPerLock = userAccount.rpsDuringLastClaimForLock[lockId][streamId];
        console.log(userRpsPerLock);
        uint256 userSharesOfLock = lock.positionStreamShares;
        return ((latestRps - userRpsPerLock) * userSharesOfLock)/RPS_MULTIPLIER;
    }
    



    /// @dev gets the user's stream pending reward
    /// @param streamId stream index
    /// @param account user account
    /// @return user.pendings[streamId]
    function getPending(uint256 streamId, address account) 
        external
        view
        override
        returns (uint256)
    {
        return users[account].pendings[streamId];
    }

}
