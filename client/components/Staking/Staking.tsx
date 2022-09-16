import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
import { Button, Input, SimpleGrid, Box } from '@chakra-ui/react';
import { toWei, fromWei } from '../../helpers/base';
import { sendTransaction as stakingTransactions } from "../../helpers/stakingContract.js";
import { makeBatchCall as stakingBatchCalls } from '../../helpers/stakingContract.js';

import { sendTransaction as mainTokenTransactions } from '../../helpers/mainToken.js'
import { sendTransaction as veMainTokenTransaction } from "../../helpers/veMainToken.js";
import { makeBatchCall as veMainTokenCalls } from '../../helpers/veMainToken.js';

import contractAddress from "../../src/contracts/contract-address.json"
import StakingArtifact from "../../src/contracts/Staking.json";
import { observer } from "mobx-react";
import { Web3Store } from '../../store/web3Store';
import InputRange from "react-input-range";


const Staking = observer((props) => {
  const state = {
    value: 0
  }

  const [VOTETokenBalance, setVOTETokenBalance] = useState("0")
  const [unlockPeriod, setUnlockPeriod] = useState<number | undefined>(0)
  const [stakePosition, setStakePosition] = useState<number | undefined>(0)
  
  const getTimeStamp = async () => {

    var blockNumber = await Web3Store.web3.eth.getBlockNumber();
    var block = await Web3Store.web3.eth.getBlock(blockNumber);

    var timestamp = block.timestamp
    return timestamp;
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
    let lockingPeriod = parseInt((await getTimeStamp()).toString()) + unlockPeriod * 604800;

    await mainTokenTransactions(
      "approve",
      [contractAddress.Staking, toWei(stakePosition,"ether")],
      { from: Web3Store.account }
    )
    await stakingTransactions(
      "createLock",
      [toWei(stakePosition,"ether"), lockingPeriod],
      { from: Web3Store.account }
    )


  }

  const handleChange = (event) => {
    setUnlockPeriod(event.target.value);
  }




  const getVoteBalance = async () => {
    const methods = [
      // { methodName: "stakedEthTotal" },
      { methodName: "balanceOf", args: [Web3Store.account] },
      // { methodName: "lastUpdateTime" }
    ];
    setVOTETokenBalance((await veMainTokenCalls(methods)).toString());
  }

  // const getVoteBalance = async() => {
  //   let web3 = Web3Store.web3;
  //   const address = contractAddress.Staking
  //   let contractInstance;

  //   contractInstance = new web3.eth.Contract(StakingArtifact.abi, address);

  //   await contractInstance.methods.getLockInfo("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",1).call();

  // }
  return (

    <div>
      <div className={classes.center}>

        <form>

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



          {/* <input
            className={classes.inputbox}
            type="week"
            id="UnlockPeriod"
            onChange={inputChangeHandler}
            value={inputValue}
            placeholder="Select Date and Time"
            min="2022-W37"
            max="2023-W37"

          ></input> */}
          <div className={classes.slideContainer}>
            <label><b>Unlock Period(weeks)</b></label>

          &nbsp; &nbsp;
        
          &nbsp; &nbsp;
            <input
              className = {classes.slider}
              id="typeinp"
              type="range"
              min="1" max="52"
              value={unlockPeriod}
              onChange={handleChange}
              step="1" />
              <br/>
              &nbsp; &nbsp;
              &nbsp; &nbsp;
              &nbsp; &nbsp;
              &nbsp; &nbsp;
              &nbsp; &nbsp;

            <label><b>{unlockPeriod} weeks</b></label>
          </div>



        </form>


        {/* 
      <button
        className={classes.stakeButton}
        onClick={() => {
          props.stakeHandler();
          setInputValue('');
        }}
      >
                Stake
      </button> */}
        <br />
        <br />
        <br />

        <Button onClick={createLock}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
        >
          Stake
        </Button>
        {/* <img src={String(stakeIcon)} alt="stake icon" className={classes.stakeIcon} /> */}

        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        <Button
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
        >
          Unstake
        </Button>

        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;

        <Button onClick={getVoteBalance}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
        >
          Log VETOKEN
        </Button>
        <br />
        <br />

        {/* <h4>
          Total Staked (by all users): {props.totalStaked} TestToken (Tst)
        </h4>
        <h5>My Stake: {props.myStake} TestToken (Tst) </h5>
        <h5>
          My Estimated Reward:{' '}
          {((props.myStake * props.apy) / 36500).toFixed(3)} TestToken (Tst)
        </h5> */}
        {VOTETokenBalance !== "0" ?
        <h5>
          VOTE Tokens Balance:{parseFloat(fromWei(VOTETokenBalance)).toFixed(2)} VOTE Token
        </h5>
        :
        <h5>
          VOTE Tokens Balance: NO VOTE Token
        </h5>
        }
      </div>
    </div>
  );
});

//My balance: 504304.394968082 TestToken (Tst)
export default Staking;
