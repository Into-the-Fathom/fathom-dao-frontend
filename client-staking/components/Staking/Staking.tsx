import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
import { Button } from '@chakra-ui/react';
import { toWei, fromWei, toBN } from '../../services/base';
import { sendTransaction as stakingTransactions } from "../../services/stakingContract.js";
import { makeCall as stakingGetterCall } from '../../services/stakingGetter';
import { sendTransaction as mainTokenTransactions } from '../../services/mainToken.js'
import { makeCall as veMainTokenCall } from '../../services/veMainToken.js';
import { makeCall as stakingContractCall } from '../../services/stakingContract.js';
import   { Staking as stakingContractAddress }  from "../../src/contracts/contract-address.js"
import { observer } from "mobx-react";
//import { Web3Store } from '../../store/web3Store';
import { useStores } from '../../store';
import { isInteger, toInteger } from 'lodash';
import Unstaking from '../Unstaking/Unstaking';
import { useEffect } from 'react';
import { getNetworkId } from '../../services/base';
import { useCallback } from 'react';
import StakeModal from '../Modals/StakeModal'
import { makeCall as mainTokenCall } from '../../services/mainToken.js';
import { getAPR, getVoteBalance, getWalletBalance } from '../../services/getAllStakeModal';
import { Progress } from '@chakra-ui/react';
import {
  Box,
  HStack,
  Grid,
  GridItem
} from "@chakra-ui/react";
declare var window: any

const Staking = observer(() => {
  const { web3Store, govnStore, stakingStore } = useStores();

  const [lockPositions, setLockPositions] = useState([]);

  const [progress, setProgress] = useState<boolean>(false);



  const [apr, setAPR] = useState("N/A")
  const [totalStakedPosition,setTotalStakedPosition] = useState("0")


  useEffect(() => {
    
    const handleAccountsChanged =  () => {
      window.location.reload();
    };
    const handleChainChanged =  () => {
      window.location.reload();
    };

    if(window.ethereum){
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    if(window.ethereum){
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    
  }, []);


  const _getAllLocks = useCallback(async () => {
    await getAllLocks()
  }, [])

  

  useEffect(() => {
    if (web3Store.hasProvider) {
      _getAllLocks()
     
     }
  },[])


  const [displayAllLocks, setDisplayAllLocks] = useState(false)

  const [seed, setSeed] = useState(0)

  const [VOTETokenBalance, setVOTETokenBalance] = useState("0")
  const [unlockPeriod, setUnlockPeriod] = useState<number | undefined>(1)
  const [stakePosition, setStakePosition] = useState<number | undefined>(0)

  const getTimeStamp = async () => {

    var blockNumber = await web3Store.web3.eth.getBlockNumber();
    var block = await web3Store.web3.eth.getBlock(blockNumber);

    var timestamp = block.timestamp
    return timestamp;
  }

  const _convertToEtherBalance =  (balance) => {
    return parseFloat(fromWei(balance)).toFixed(0)
  }



  const handleUnlock = async (lockId: number) => {
    setProgress(true)
    await stakingTransactions(
      "unlock",
      [lockId],
      { from: web3Store.account }
    )
    await loadAll();
    console.log("...........Unlocking")
    setSeed(Math.random());
    setProgress(false)
  }

  const handleEarlyUnlock = async (lockId: number) => {
    setProgress(true)
    await stakingTransactions(
      "earlyUnlock",
      [lockId],
      { from: web3Store.account }
    )
    await loadAll();
    console.log("...........Unlocking")
    setSeed(Math.random());
    setProgress(false)
  }


  const _createLockPositionObject = async (
      _lockId, 
      _VOTETokenBalance, 
      _MAINTokenBalance,
      _RemainingUnlockPeriod,
      _FTHMRewards) => {
    return {
      lockId: _lockId,
      VOTETokenBalance: await _convertToEtherBalance(_VOTETokenBalance),
      MAINTokenBalance: await _convertToEtherBalance(_MAINTokenBalance),
      FTHMRewards: await _convertToEtherBalance(_FTHMRewards),
      RemainingUnlockPeriod: _RemainingUnlockPeriod
    }
  }

  const [inputValue, setInputValue] = useState('');

  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    setStakePosition(event.target.value);
  };

  const isConnected =  () => {
    return web3Store.hasProvider
  }

  const isCreateLockable = () => {
    //TODO: Check for Balance
      return isConnected();
  }

  const createLock = async () => {
    setProgress(true)
    const day = 24 * 60 * 60
    console.log("timestamp: ", (await getTimeStamp()).toString())
    let lockingPeriod = unlockPeriod * day;
    let endTime =parseInt((await getTimeStamp()).toString()) + 2*60;
    
    ///For testing Only: Remove It
    if (lockingPeriod > 0) {
      endTime = parseInt((await getTimeStamp()).toString()) + lockingPeriod;
    }

    await mainTokenTransactions(
      "approve",
      [stakingContractAddress.address[getNetworkId()], toWei(stakePosition, "ether")],
      { from: web3Store.account }
    )

    console.log(getNetworkId())
    await stakingTransactions(
      "createLock",
      [toWei(stakePosition, "ether"), endTime],
      { from: web3Store.account }
    )

    await loadAll()
    setProgress(false)

  }

  const loadAll = async () => {
    await getAllLocks()
    await getAPR()
    await getVoteBalance()
    await getWalletBalance()
  }

  const getAllLocks = async () => {
    let totalStakedPosition = toBN("0")

    let result = await stakingGetterCall(
      "getLocksLength",
      [web3Store.account],
    )
    console.log(result)

    let lockPositionsList = []
    let retrievedLockPosition: any;
    let constructedLockPosition: any
    for (let i = 0; i < toInteger(result); i++) {

      const { 0: amountOfMAINTkn, 1: amountOfveMAINTkn, 2: mainTknShares, 3: positionStreamShares, 4: end, 5: owner } =
        await stakingGetterCall(
          "getLock",
          [web3Store.account, i + 1]
        )

        let amountOfFTHMAvailable = await stakingContractCall(
          "getStreamClaimableAmountPerLock",
          [0, web3Store.account, i + 1]
        )
        
      constructedLockPosition = await _createLockPositionObject(
        i + 1,
        amountOfveMAINTkn,
        amountOfMAINTkn,
        
        end,
        amountOfFTHMAvailable,
      )

      lockPositionsList.push(constructedLockPosition)
      totalStakedPosition = totalStakedPosition.add(toBN(amountOfMAINTkn))

    }
    const totalStakedPositionToEther = _convertToEtherBalance(totalStakedPosition)
    setTotalStakedPosition(totalStakedPositionToEther)
    setDisplayAllLocks(true)
    setLockPositions(lockPositionsList)
    stakingStore.setTotalStakedBalance(totalStakedPositionToEther)
  }

  const allLockPositionHandler = async () => {
  
    await getAllLocks()
    await loadAll()
    
  }

  const handleChange = (event) => {
    setUnlockPeriod(event.target.value);
  }



  return (

      <Box className={classes.center}>
        { progress && <Progress size='xs' isIndeterminate /> } 
      <HStack spacing='10px'>
        <Box mt='50px' width="75%">

          <label htmlFor="StakeValue"><b> Enter Lock Position </b></label>
          &nbsp; &nbsp;
          &nbsp; &nbsp;
          <input
            className={classes.inputbox}
            type="number"
            min="0"
            step="1"
            id="StakeValue"
            onChange={inputChangeHandler}
            value={inputValue}
            
          ></input>
          <br />
          <br />
          <br />

          &nbsp; &nbsp;
          &nbsp; &nbsp;
          &nbsp; &nbsp;


          &nbsp; &nbsp;



          <div className={classes.slideContainer}>
            <label><b>Unlock Period(days)</b></label>

            &nbsp; &nbsp;

            &nbsp; &nbsp;
            <input
              className={classes.slider}
              id="typeinp"
              type="range"
              min="0" max="365"
              value={unlockPeriod}
              onChange={handleChange}
              step="1" />
            <br />
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;

            <label><b>{unlockPeriod} days</b></label>
          </div>


        <br />
        <br />
        <br />

        <Button onClick={createLock}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          bg='gray'
          textColor='black'
          disabled={!isCreateLockable()}
        >
          Stake
        </Button>
        {/* <img src={String(stakeIcon)} alt="stake icon" className={classes.stakeIcon} /> */}

        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;

        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;



        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
      
      { 
      displayAllLocks == false &&
        <Button onClick={allLockPositionHandler}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          bg='gray'
          textColor='black'
          disabled={!isConnected()}
        >
          All Lock Positions
        </Button>
      }
        </Box>

         <StakeModal apr={apr} totalStakedPosition={totalStakedPosition}></StakeModal>

        </HStack>
    
        <br />
        <br />
        



        {
        displayAllLocks == true && lockPositions.length > 0 &&
              <Unstaking
                lockPositions={lockPositions}
                handleUnlock={handleUnlock} 
                handleEarlyUnlock = {handleEarlyUnlock}/>
         
        } 
        {
          displayAllLocks == true && lockPositions.length == 0 &&
          <div>
            <Box
              color='gray.500'
              fontWeight='semibold'
              letterSpacing='wide'
              fontSize='xl'
              textTransform='uppercase'
              mb='5'
              padding='20px'
            >
              No Lock Positions
            </Box>

          </div>
        }

      </Box>
  );
});

//My balance: 504304.394968082 TestToken (Tst)
export default Staking;
