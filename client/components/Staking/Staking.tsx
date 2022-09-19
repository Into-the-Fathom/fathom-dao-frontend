import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
import { Button } from '@chakra-ui/react';
import { toWei, fromWei } from '../../helpers/base';
import { sendTransaction as stakingTransactions } from "../../helpers/stakingContract.js";
import { makeBatchCall as stakingBatchCalls } from '../../helpers/stakingContract.js';
import { makeCall as stakingGetterCall} from '../../helpers/stakingGetter';
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

const Staking = observer((props) => {

  useEffect(() => {
    if(web3Store.hasProvider){
        web3Store.provider.on("accountsChanged", () => {
            console.log("......AccountsChanged")
            //  const handleAccountChanged = async () =>{
            //     const injectedProvider = web3Store.provider;
            //     const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
            //     web3Store.setAccount(accounts[0])
            //     const balance = await web3Store.web3.eth.getBalance(accounts[0])
            //     console.log('balance', balance)
            //     web3Store.setEtherBalance(parseInt(balance)/1e18)
            //  }

            //  const result = handleAccountChanged().catch(console.error)
            window.location.reload();
        })
    }
  });
  const {web3Store, govnStore} = useStores();
  
  const [lockPositions, setLockPositions] = useState([
    {
      lockId:null,
      VOTETokenBalance: "",
      MAINTokenBalance: "",
      RemainingUnlockPeriod: ""
    }
  ]);
  const [addLockData, setLockData] = useState({
      VOTETokenBalance: "",
      MAINTokenBalance: "",
      RemainingUnlockPeriod: ""
  })


  const [displayAllLocks, setDisplayAllLocks] = useState(false)


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
    return parseFloat(fromWei(balance)).toFixed(2)
  }

  const secondsToTime = (secs) => {
    secs = parseInt(secs)
    let days = Math.floor(secs/ (24 * 60 * 60))
    let remainingSecs = secs-days*24*60*60
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
  const _calculateRemainingUnlockPeriod = async(unlockPeriod) => {
    
    return unlockPeriod - await getTimeStamp()
  }

  const _createLockPositionObject =async (_lockId, _VOTETokenBalance,_MAINTokenBalance,_RemainingUnlockPeriod) => 
    {
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
    let lockingPeriod = parseInt((await getTimeStamp()).toString()) + unlockPeriod * 604800;
    displayAllLocks
    await mainTokenTransactions(
      "approve",
      [contractAddress.Staking, toWei(stakePosition,"ether")],
      { from: web3Store.account }
    )
    await stakingTransactions(
      "createLock",
      [toWei(stakePosition,"ether"), lockingPeriod],
      { from: web3Store.account }
    )

    await getVoteBalance()

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
    for (let i = 0; i< toInteger(result);i++){
      
      const {0:amountOfMAINTkn,1:amountOfveMAINTkn,2:mainTknShares,3:positionStreamShares,4:end,5:owner}=
      await stakingGetterCall(
        "getLock",
        [web3Store.account, i+1]
      )
      console.log("enddd",end)
      constructedLockPosition = await _createLockPositionObject(
          i+1,
          amountOfMAINTkn,
          amountOfveMAINTkn,
          end
      )
      lockPositionsList.push(constructedLockPosition)
      
    }
    
    setLockPositions(lockPositionsList)
    setDisplayAllLocks(true)
}

  const handleChange = (event) => {
    setUnlockPeriod(event.target.value);
  }




  const getVoteBalance = async () => {
    setDisplayAllLocks(false)
    let result = await veMainTokenCall(
      "balanceOf",
      [web3Store.account]
    )
    
    var _voteTokenBalance = result.toString()
    setVOTETokenBalance(_voteTokenBalance);
    govnStore.setVoteTokeBalance(_voteTokenBalance)
  }


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
          VOTE TOKEN BALANCE
        </Button>

        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;
        &nbsp; &nbsp;

        <Button onClick={getAllLocks}
          size='md'
          height='48px'
          width='200px'
          border='2px'
          borderColor='green.500'
        >
          All Lock Positions
        </Button>
        <br />
        <br />

        {VOTETokenBalance !== "0" && displayAllLocks!=true?
        <h5>
          VOTE Tokens Balance:{parseFloat(fromWei(VOTETokenBalance)).toFixed(2)} VOTE Token
        </h5>:<div></div>
      
        }

        {displayAllLocks == true?
                <h5>
                <Unstaking
                 lockPositions={lockPositions}/>
           </h5>:
           <div></div>
      }
      </div>
    </div>
  );
});

//My balance: 504304.394968082 TestToken (Tst)
export default Staking;
