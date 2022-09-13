import React, { useState } from 'react';
import classes from "../../styles/Staking.module.css";
const Reward = (props) => {
  
  
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

    <button
        className={classes.stakeButton}
        onClick={() => {
          props.claimRewards();
          setInputValue('');
        }}
      >
        {/* <img src={String(stakeIcon)} alt="stake icon" className={classes.stakeIcon} /> */}
        Claim Rewards
      </button>
      &nbsp; &nbsp;
      &nbsp; &nbsp;
      &nbsp; &nbsp;
      &nbsp; &nbsp;
      <button className={classes.unstakeButton} onClick={props.claimAllRewards()}>
        {/* <img
          src={String(unstakeIcon)}
          alt="unstake icon"
          className={classes.stakeIcon}
        /> */}
        Claim All Rewards
      </button>
      
        <h4>
          Total Staked (by all users): {props.totalStaked} TestToken (Tst)
        </h4>
        <h5>My Stake: {props.myStake} TestToken (Tst) </h5>
        <h5>
          My Lock Position Rewards:
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
export default Reward;
