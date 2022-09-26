import React, { useState, useEffect } from 'react';
import classes from "../../styles/Staking.module.css";
import { makeCall as stakingGetterCall } from '../../services/stakingGetter';
import { useStores } from '../../store';
import { isInteger, toInteger } from 'lodash';
import { toWei, fromWei } from '../../services/base';
import { useCallback } from 'react';
import LockPositionRows from './LockPositions';
import { makeCall as stakingContractCall } from '../../services/stakingContract';
import { sendTransaction as stakingSendTransaction } from '../../services/stakingContract';
import { observer } from "mobx-react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Button,
  Box
} from '@chakra-ui/react'
declare var window: any
const Reward = observer(() => {

  
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



  const [seed, setSeed] = useState(0)

  const { web3Store, govnStore } = useStores();
  const [inputValue, setInputValue] = useState('');
  const [lockPositions, setLockPositions] = useState([
  ]);
  const [displayLockPositions, setDisplayLockPositions] = useState(false)

  const _convertToEtherBalance = async (balance) => {
    return parseFloat(fromWei(balance)).toFixed(5)
  }

  const _createLockPositionObject = async (_lockId, _MAINTokenBalance, _AMOUNTOfRewardsAvailable) => {
    return {
      lockId: _lockId,
      MAINTokenBalance: await _convertToEtherBalance(_MAINTokenBalance),
      AMOUNTOfRewardsAvailable: await _convertToEtherBalance(_AMOUNTOfRewardsAvailable)
    }
  }

  const viewLockPositionHandler = async() => {
    setDisplayLockPositions(true)
    await getAllLocks()
  }

  const isConnected = () => {
      return web3Store.hasProvider
  }

  const getStreamData =async (streamId) => {

    
    const { 0: streamOwner, 
            1: rewardToken, 
            2: rewardDepositAmount, 
            3: rewardClaimedAmount, 
            4: maxDepositAmount, 
            5: rps, 
            6: tau, 
            7: status}
     = await stakingContractCall(
      "getStream",
      [streamId])

    
  }
  const getAllLocks = async () => {


    let result = await stakingGetterCall(
      "getLocksLength",
      [web3Store.account],
    )
    console.log("//here",result)

    let lockPositionsList = []
    let retrievedLockPosition: any;
    let constructedLockPosition: any
    for (let i = 0; i < toInteger(result); i++) {

      const { 0: amountOfMAINTkn, 1: amountOfveMAINTkn, 2: mainTknShares, 3: positionStreamShares, 4: end, 5: owner } =
        await stakingGetterCall(
          "getLock",
          [web3Store.account, i + 1]
        )
        
     
        let amountOfRewardsAvailable = await stakingContractCall(
          "getStreamClaimableAmountPerLock",
          [1, web3Store.account, i + 1]
        )
        if (amountOfRewardsAvailable > 1e18){
          amountOfRewardsAvailable = 0
        }
      
      constructedLockPosition = await _createLockPositionObject(
        i + 1,
        amountOfMAINTkn,
        amountOfRewardsAvailable
      )

      console.log("ust this",i,amountOfRewardsAvailable)


      lockPositionsList.push(constructedLockPosition)

    }
    setLockPositions(lockPositionsList)
    setDisplayLockPositions(true)

  }

  const handleClaimRewards = async () => {
    await stakingSendTransaction(
      "claimAllLockRewardsForStream",
      [1],
      { from: web3Store.account }
    )

    await getAllLocks()

    setSeed(Math.random())
  }

  const handleWithdrawRewards = async () => {
    await stakingSendTransaction(
      "withdrawAll",
      [],
      { from: web3Store.account }
    )

    setSeed(Math.random())
  }


  return (

    <div className={classes.center}>
      <div>

     { 
     displayLockPositions ==false && 
          <Button type="button"
          disabled={!isConnected()}
          onClick={viewLockPositionHandler}
        > View Lock Position </Button>

      }
      {
        displayLockPositions == true && lockPositions.length > 0 && <TableContainer key={seed}>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  Token Balance
                </Th>

                <Th>
                  Rewards Available
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                lockPositions.map((lockPosition) => {
                  return <LockPositionRows
                    lockPosition={lockPosition}
                  />
                })}

            </Tbody>
          </Table>
        </TableContainer>
      }

    {
          displayLockPositions == true && lockPositions.length == 0 &&
          <div>
            <Box
              color='gray.500'
              fontWeight='semibold'
              letterSpacing='wide'
              fontSize='xl'
              textTransform='uppercase'
              mb='5'
              border='1px' borderColor='gray.200'
              padding='20px'
            >
              No Lock Positions
            </Box>

          </div>
        }



        <Button type="button"
          onClick={handleClaimRewards}
          disabled={!isConnected()}
        > Claim Rewards </Button>

        <Button type="button"
          onClick={handleWithdrawRewards}
          disabled={!isConnected()}
        > Withdraw Rewards </Button>


      </div>
    </div>
  );
})
;
//My balance: 504304.394968082 TestToken (Tst)
export default Reward;
