import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
import { Button,Input,SimpleGrid,Box } from '@chakra-ui/react';


const Staking = (props) => {


  const [inputValue, setInputValue] = useState('');

  const inputChangeHandler = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
    props.inputHandler(event.target.value);
  };

  const goMax = () => {
    setInputValue(props.userBalance);
    props.inputHandler(props.userBalance);
  };

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





          <label htmlFor="UnlockPeriod"><b> Unlock Period </b></label>
          &nbsp; &nbsp;
          &nbsp; &nbsp;
          &nbsp; &nbsp;

          
          &nbsp; &nbsp;

          <input
            className={classes.inputbox}
            type="datetime-local"
            id="UnlockPeriod"
            onChange={inputChangeHandler}
            value={inputValue}
            placeholder="Select Date and Time"
          ></input>

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

        <Button
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
        <br />
        <br />

        <h4>
          Total Staked (by all users): {props.totalStaked} TestToken (Tst)
        </h4>
        <h5>My Stake: {props.myStake} TestToken (Tst) </h5>
        <h5>
          My Estimated Reward:{' '}
          {((props.myStake * props.apy) / 36500).toFixed(3)} TestToken (Tst)
        </h5>
        <h5 onClick={goMax} className={classes.goMax}>
          My balance: {props.userBalance} TestToken (Tst)
        </h5>
      </div>
    </div>
  );
};
//My balance: 504304.394968082 TestToken (Tst)
export default Staking;
