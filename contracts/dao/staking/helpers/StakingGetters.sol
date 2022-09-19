// Copyright SECURRENCY INC.
// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.13;
import "../interfaces/IStakingGetter.sol";
import "./IStakingHelper.sol";
import "../StakingStructs.sol";
contract StakingGetters  {

    address private stakingContract;

    constructor(address _stakingContract) {
        stakingContract = _stakingContract;
    }
    function getLatestRewardsPerShare(uint256 streamId) external view  returns (uint256) {
        return IStakingHelper(stakingContract).getLatestRewardsPerShare(streamId);
    }

    function getLockInfo(address account, uint256 lockId) external view  returns (LockedBalance memory) {

        LockedBalance[] memory locks = IStakingHelper(stakingContract).getAllLocks(account);
        require(lockId <= locks.length, "getLockInfo: LockId out of index");
        return locks[lockId - 1];
    }

    function getLocksLength(address account) external  view returns (uint256) {
        LockedBalance[] memory locks = IStakingHelper(stakingContract).getAllLocks(account);
        return locks.length;
    }

    function getLock(address account, uint lockId) external  view returns(uint128, uint128, uint128, uint128, uint64, address){
        LockedBalance[] memory locks = IStakingHelper(stakingContract).getAllLocks(account);
        LockedBalance memory lock = locks[lockId - 1];
        require(lockId <= locks.length, "getLockInfo: LockId out of index");
        return(
            lock.amountOfMAINTkn,
            lock.amountOfveMAINTkn,
            lock.mainTknShares,
            lock.positionStreamShares,
            lock.end,
            lock.owner
        );
    }

  

    /// @dev gets the total user deposit
    /// @param account the user address
    /// @return user total deposit in (Main Token)
    function getUserTotalDeposit(address account)
        external
        view
        returns (uint256)
    {   
        LockedBalance[] memory locks = IStakingHelper(stakingContract).getAllLocks(account);
        uint totalDeposit = 0;
        for(uint i = 0;i<locks.length;i++){
            totalDeposit += locks[i].amountOfMAINTkn;
        }
        return totalDeposit;
    }




    // /// @dev get the stream data
    // /// @notice this function doesn't return the stream
    // /// schedule due to some stake slots limitations. To
    // /// get the stream schedule, refer to getStreamSchedule
    // /// @param streamId the stream index
    // function getStream(uint256 streamId)
    //     external
    //     view
    //     override
    //     returns (
    //         address streamOwner,
    //         address rewardToken,
    //         uint256 rewardDepositAmount,
    //         uint256 rewardClaimedAmount,
    //         uint256 maxDepositAmount,
    //         uint256 rps,
    //         uint256 tau,
    //         StreamStatus status
    //     )
    // {

    //     Stream memory stream = IStakingHelper(stakingContract).streams[streamId];
    //     return (
    //         stream.owner,
    //         stream.rewardToken,
    //         stream.rewardDepositAmount,
    //         stream.rewardClaimedAmount,
    //         stream.maxDepositAmount,
    //         stream.rps,
    //         stream.tau,
    //         stream.status
    //     );
    // }

}
