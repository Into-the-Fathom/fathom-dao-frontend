import React, { useCallback, useEffect } from "react";
import { Button } from '@chakra-ui/react';
import { fromWei } from "../../services/base";
import classes from '../../styles/UnlockRows.module.css'
import { useStores } from "../../store";
import { useState } from "react";
import { makeCall as stakingMakeCall } from "../../services/stakingContract";

import {
  Tr,
  Td,
  Box
} from '@chakra-ui/react'

 


const UnlockRows = ({ lockPosition, handleUnlock, handleEarlyUnlock }) => {

  const [remainingTime, setRemainingTime] = useState(0)
  const [remainingTimeObject, setRemainingTimeObject] = useState({
    days: null,
    h: null,
    m: null,
    s: null
  })


  const { web3Store } = useStores()

  const getTimeStamp = async () => {

    var blockNumber = await web3Store.web3.eth.getBlockNumber();
    var block = await web3Store.web3.eth.getBlock(blockNumber);

    var timestamp = block.timestamp

    return timestamp;
  }
  const secondsToTime = (secs) => {

    let days = Math.floor(secs / (24 * 60 * 60))
    let remainingSecs = secs - days * 24 * 60 * 60
    let hours = Math.floor(remainingSecs / (60 * 60));

    let divisor_for_minutes = remainingSecs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "days": days,
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  const _calculateRemainingTime = async () => {

    const unlockPeriod = lockPosition.RemainingUnlockPeriod
    const _remainingTime = unlockPeriod - await getTimeStamp()
    setRemainingTime(_remainingTime)
    return _remainingTime

  }

  const _convertToTimeObject = useCallback(async () => {

    const remainingTime = await _calculateRemainingTime()
    const timeObject = secondsToTime(remainingTime)
    //console.log(timeObject)
    setRemainingTimeObject(timeObject)
    return remainingTime
  }, [])

  useEffect(() => {
    _convertToTimeObject().catch(console.error)

  }, [])


  const isItUnlockable = () => {
    const isItUnlockable = remainingTime == 0 || remainingTime < 0;
    return isItUnlockable
  }
//   const getOneDayReward = (streamId) => {
//       const streamSchedule = await staking.getStreamSchedule(streamId)
//       const now = Math.floor(Date.now() / 1000)
//       const oneDay = 86400
//       const streamStart = schedule[0][0].toNumber()
//       const streamEnd = schedule[0][schedule[0].length - 1].toNumber()
//       if (now <= streamStart) return ethers.BigNumber.from(0) // didn't start
//       if (now >= streamEnd - oneDay) return ethers.BigNumber.from(0) // ended
//       const currentIndex = schedule[0].findIndex(indexTime => now < indexTime) - 1
//       const indexDuration = schedule[0][currentIndex + 1] - schedule[0][currentIndex]
//       const indexRewards = schedule[1][currentIndex].sub(schedule[1][currentIndex + 1])
//       const oneDayReward = indexRewards.mul(oneDay).div(indexDuration)
//       return oneDayReward
//   }
//   ```
  
//   APR calculation:
//   ```js
//       const oneDayReward = await getOneDayReward(streamId)
//       const totalStaked = await staking.getTotalAmountOfStakedAurora()
  
//       // streamTokenPrice can be queried from coingecko.
//       const totalStakedValue = Number(ethers.utils.formatUnits(totalStaked, 18)) * streamTokenPrice
//       const oneYearStreamRewardValue = Number(ethers.utils.formatUnits(oneDayReward, 18)) * 365 * streamTokenPrice
//       const streamAPR = oneYearStreamRewardValue * 100 / totalStakedValue
//       const totalAPR = allStreamsCumulatedOneYearRewardValue * 100 / totalStakedValue
//  

const getOneDayRewardForStream1 = () => {
  const now = Math.floor(Date.now() / 1000)
  const oneDay = 86400
  const oneYear = 365 * 24 * 60 * 60
  const streamStart = 2000
  const streamEnd = 0

  const oneDayReward = 2000 * oneDay / oneYear;
  return oneDayReward
}

const getAPR = async () => {
  const oneYear = 365 * 24 * 60 * 60
  const oneDayReward = getOneDayRewardForStream1()
  const oneYearStreamRewardValue = oneDayReward * 365;
  const totalStaked =  await stakingMakeCall(
    "totalAmountOfStakedMAINTkn",
    [web3Store.account]
  );
  
  const totalAPR = oneYearStreamRewardValue * 100 / totalStaked;
  
  
  console.log(totalAPR)
}

const getTotalStake = () => {

}

const getTotalBalance = () => {

}


  return (
    <Tr
    fontWeight='semibold'
    textColor='white'>
      <Td>
      {lockPosition.MAINTokenBalance} FTHM
      </Td>

      <Td>
        {lockPosition.VOTETokenBalance} VEFTHM
      </Td>

      {!isItUnlockable() ? <Td>

        <div className={classes.blank}>

              <Box  
                width='55'
                display='inline-block'
                h='10'
                fontWeight='semibold'
                fontSize='l'
                textColor="white"
                textAlign='center'
                verticalAlign='middle'>{remainingTimeObject.days} DAYS {remainingTimeObject.h} hrs {remainingTimeObject.m} mins {remainingTimeObject.s} secs
              </Box>

        </div>
      </Td> : 
      <Td>   <div className={classes.blank}>
              <Box  
                display='inline-block'
                fontWeight='bold'
                
                fontSize='lg'
                textColor="white"
                textAlign='center'
                verticalAlign='middle'>Lock Open
              </Box>
              </div>
            
      </Td>
      }


      <Td>
        <Button type="button"
          disabled={!isItUnlockable()}
          onClick={() => handleUnlock(lockPosition.lockId)}
        > Unlock </Button>
      </Td>

      <Td>
        <Button type="button"
          disabled={isItUnlockable()}
          onClick={() => handleEarlyUnlock(lockPosition.lockId)}
        > Early Withdraw </Button>
      </Td>
    </Tr>
  )
}

export default UnlockRows