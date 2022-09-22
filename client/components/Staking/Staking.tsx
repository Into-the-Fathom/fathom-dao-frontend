import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
import { Button } from '@chakra-ui/react';
import { toWei, fromWei } from '../../helpers/base';
import { sendTransaction as stakingTransactions } from "../../helpers/stakingContract.js";
import { makeBatchCall as stakingBatchCalls } from '../../helpers/stakingContract.js';
import { makeCall as stakingGetterCall } from '../../helpers/stakingGetter';
import { sendTransaction as mainTokenTransactions } from '../../helpers/mainToken.js'
import { makeCall as veMainTokenCall } from '../../helpers/veMainToken.js';

import contractAddress from "../../src/contracts/contract-address.json"
import StakingArtifact from "../../src/contracts/Staking.json";
import { observer } from "mobx-react";
//import { Web3Store } from '../../store/web3Store';
import InputRange from "react-input-range";
import { useStores } from '../../store';
import { UseAppStore } from '../../pages/AppStoreContext';
import { isInteger, toInteger } from 'lodash';
import { useEffect } from 'react';
import Unstaking from '../Unstaking/Unstaking';
import {
  Box
} from "@chakra-ui/react";

const Staking = observer((props) => {
  //  const handleAccountChanged = async () =>{
  //     const injectedProvider = web3Store.provider;
  //     const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
  //     web3Store.setAccount(accounts[0])
  //     const balance = Pawait web3Store.web3.eth.getBalance(accounts[0])
  //     console.log('balance', balance)
  //     web3Store.setEtherBalance(parseInt(balance)/1e18)
  //  }

  //  const result = handleAccountChanged().catch(console.error)  
  useEffect(() => {
    if (web3Store.hasProvider) {
      web3Store.provider.on("accountsChanged", () => {
        console.log("......AccountsChanged")

        window.location.reload();
      })
    }
  });
  const { web3Store, govnStore } = useStores();

  const [lockPositions, setLockPositions] = useState([
  ]);


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

  const _convertToEtherBalance = async (balance) => {
    return parseFloat(fromWei(balance)).toFixed(0)
  }

  const secondsToTime = (secs) => {
    secs = parseInt(secs)
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
  const _calculateRemainingUnlockPeriod = async (unlockPeriod) => {

    return unlockPeriod - await getTimeStamp()
  }

  const handleUnlock = async (lockId: number) => {
    await stakingTransactions(
      "unlock",
      [lockId],
      { from: web3Store.account }
    )
    await getAllLocks();
    console.log("...........Unlocking")
    setSeed(Math.random());

  }

  const _createLockPositionObject = async (_lockId, _VOTETokenBalance, _MAINTokenBalance, _RemainingUnlockPeriod) => {
    return {
      lockId: _lockId,
      VOTETokenBalance: await _convertToEtherBalance(_VOTETokenBalance),
      MAINTokenBalance: await _convertToEtherBalance(_MAINTokenBalance),
      RemainingUnlockPeriod: _RemainingUnlockPeriod
    }
  }

  const [inputValue, setInputValue] = useState('');

  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    setStakePosition(event.target.value);
  };

  const goMax = () => {
    setInputValue(props.userBalance);
    props.inputHandler(props.userBalance);
  };

  const createLock = async () => {
    const WEEK = 604800
    console.log("timestamp: ", (await getTimeStamp()).toString())
    let lockingPeriod = unlockPeriod * WEEK;
    let endTime = 0
    ///For testing Only: Remove It
    if (lockingPeriod > 0) {
      endTime = parseInt((await getTimeStamp()).toString()) + lockingPeriod;
    }

    await mainTokenTransactions(
      "approve",
      [contractAddress.Staking, toWei(stakePosition, "ether")],
      { from: web3Store.account }
    )
    await stakingTransactions(
      "createLock",
      [toWei(stakePosition, "ether"), endTime],
      { from: web3Store.account }
    )

    await getAllLocks()

  }

  const getAllLocks = async () => {


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
      console.log("enddd", end)
      constructedLockPosition = await _createLockPositionObject(
        i + 1,
        amountOfveMAINTkn,
        amountOfMAINTkn,
        end
      )

      lockPositionsList.push(constructedLockPosition)

    }
    setLockPositions(lockPositionsList)
    await getVoteBalance()

  }

  const allLockPositionHandler = async () => {
    await getAllLocks()
    setDisplayAllLocks(!displayAllLocks)
  }

  const handleChange = (event) => {
    setUnlockPeriod(event.target.value);
  }




  const getVoteBalance = async () => {
    const beforeVOTETokenBalance = _voteTokenBalance
    let result = await veMainTokenCall(
      "balanceOf",
      [web3Store.account]
    )

    var _voteTokenBalance = result.toString()
    setVOTETokenBalance(_voteTokenBalance);
    govnStore.setVoteTokeBalance(_voteTokenBalance)
    ///@notice: This is for frontend so that marginal vote release is not displayed

  }



  return (

      <Box className={classes.center}>

        <Box>

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
            <label><b>Unlock Period(weeks)</b></label>

            &nbsp; &nbsp;

            &nbsp; &nbsp;
            <input
              className={classes.slider}
              id="typeinp"
              type="range"
              min="0" max="52"
              value={unlockPeriod}
              onChange={handleChange}
              step="1" />
            <br />
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;
            &nbsp; &nbsp;

            <label><b>{unlockPeriod} weeks</b></label>
          </div>


        <br />
        <br />
        <br />

        <Button onClick={createLock}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
          bg='#00FFF9'
          textColor='black'
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

        <Button onClick={allLockPositionHandler}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
          bg='#00FFF9'
          textColor='black'
        >
          All Lock Positions
        </Button>
        </Box>
        <br />
        <br />



        {displayAllLocks == true && lockPositions.length > 0 &&

          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xl'
            textTransform='uppercase'
            m='5'
            border='2px' borderColor='gray.200'
          >
           
              <Unstaking
                getAllLocks={async () => getAllLocks}
                lockPositions={lockPositions}
                handleUnlock={handleUnlock} />
              <Box
                color='white'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xl'
                textTransform='uppercase'
                m='5'
                border='2px' borderColor='gray.200'
              >
                Total VOTE Tokens Balance:   {parseFloat(fromWei(VOTETokenBalance)).toFixed(0)} VOTE Token
              </Box>

          </Box>
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
              m='5'
              border='2px' borderColor='gray.200'
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
