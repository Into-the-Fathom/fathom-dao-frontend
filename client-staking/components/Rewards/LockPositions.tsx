import React, { useCallback, useEffect } from "react";
import { useStores } from "../../store";
import { useState } from "react";
import {
  Tr,
  Td,
} from '@chakra-ui/react'




const LockPositionRows = ({ lockPosition }) => {

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


  

  return (
    <Tr>
     
     <Td>
        {lockPosition.MAINTokenBalance}
      </Td>

      <Td>
        {lockPosition.AMOUNTOfRewardsAvailable}
      </Td>

    </Tr>
  )
}

export default LockPositionRows