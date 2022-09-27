
import classes from "../../styles/Staking.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { makeCall as stakingMakeCall } from "../../services/stakingContract";
import { fromWei } from "../../services/base";
import { makeCall as stakingGetterCall } from '../../services/stakingGetter';
import { makeCall as mainTokenCall } from '../../services/mainToken';
import { makeCall as veMainTokenCall } from '../../services/veMainToken.js';
import { observer } from "mobx-react";
import {
    Box,
    HStack,
    Grid,
    GridItem
  } from "@chakra-ui/react";

import { useStores } from "../../store";
const StakeModal = observer(({apr,totalStakedPosition}) =>{
    
    const {web3Store, govnStore, stakingStore} = useStores();
    const [VOTETokenBalance, setVOTETokenBalance] = useState("0")

    const [walletBalance, setWalletBalance] = useState("N/A")

    const _convertToEtherBalance =  (balance) => {
        return parseFloat(fromWei(balance)).toFixed(2)
    }


  return (
      

    <Box
    color='gray.500'
    fontWeight='semibold'
    letterSpacing='wide'
    fontSize='xl'
    textTransform='uppercase'
    mr="5"
    ml="5"
    width="20%"
    bg='black'
    borderRadius='10'
    
  >
   <Grid
      h='100%'

      templateRows='repeat(2, 1fr)'
      templateColumns='repeat(4, 1fr)'
      gap={4}
      borderRadius='2'
  >
    <GridItem m='5'  rowSpan={1} colSpan={2} 
    
      textColor='white'
    
    > 
     <div className={classes.walletBalance}>{stakingStore.totalWalletBalance}</div>
     <br></br>
     
      <div className={classes.walletBalanceString}>Wallet Balance</div>
      
    </GridItem>
    
    <GridItem m='5' rowSpan={1} colSpan={2}>
        <div className={classes.stakedBalance}>{govnStore.voteTokenBalance}</div>
        <br/>
        <div className={classes.stakedBalanceString}>VOTE Balance</div>
      </GridItem>
    <GridItem m='5' rowSpan={1} colSpan={2}> 
        <div className={classes.stakedBalance}>{stakingStore.totalStakedBalance}</div>
        <br/>
        <div className={classes.stakedBalanceString}>Staked Balance</div>
    </GridItem>
    <GridItem m='5' rowSpan={1} colSpan={2}>
    <div className={classes.APR}>{stakingStore.apr}</div>
     <br/>
     <div className={classes.APRString}>Agg. APR</div>
    </GridItem>
  </Grid>
  </Box>
  )
  })

  export default StakeModal
