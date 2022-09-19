import React, { useCallback, useEffect } from "react";
import { Button } from '@chakra-ui/react';
import { fromWei } from "../../helpers/base";
import classes from '../../styles/UnlockRows.module.css'
import { useStores } from "../../store";
import { useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
  
  


const UnlockRows = ({lockPosition, handleUnlock}) => {

    
    const [remainingTime, setRemainingTime] = useState({
        days:null,
        h:null,
        m:null,
        s:null
    })

    
   const {web3Store} = useStores()

    const getTimeStamp = async () => {

        var blockNumber = await web3Store.web3.eth.getBlockNumber();
        var block = await web3Store.web3.eth.getBlock(blockNumber);
    
        var timestamp = block.timestamp
        
        return timestamp;
      }
      const secondsToTime = (secs) => {
        
        let days = Math.floor(secs/ (24 * 60 * 60))
        let remainingSecs = secs - days*24*60*60
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

      const _calculateRemainingTime = async() => {

        const unlockPeriod = lockPosition.RemainingUnlockPeriod
        const remainingTime =  unlockPeriod - await getTimeStamp()
        return secondsToTime(remainingTime)
        
      }

      const _convertToTimeObject = useCallback(async () => {
        
        const timeObject = await _calculateRemainingTime()
        console.log(timeObject)
        //console.log(timeObject)
        setRemainingTime(timeObject)
      },[])
      
    useEffect(() => {
        _convertToTimeObject().catch(console.error)

    },[])


      


    return (
        <Tr onLoad = { _convertToTimeObject}>
            <Td>
                {lockPosition.VOTETokenBalance}
            </Td>
            <Td>
                {lockPosition.MAINTokenBalance}
            </Td>
            <Td>
                <div className={classes.blank}>
                    {remainingTime.days} days {remainingTime.h} hrs {remainingTime.m} mths {remainingTime.s} secs
                </div>
            </Td>
            {/* <td>
                lockPosition.Owner
            </td> */}


              <Td>
                <Button type = "button"
                    onClick={handleUnlock}
                ></Button>
            </Td>
        </Tr>
    )
}

export default UnlockRows