import React, { useState, useEffect } from 'react';
import classes from "../../styles/Staking.module.css";
import { makeCall as stakingGetterCall } from '../../helpers/stakingGetter';
import { useStores } from '../../store';
import { isInteger, toInteger } from 'lodash';
import { toWei, fromWei } from '../../helpers/base';
import LockPositionRows from './LockPositions';
import { makeCall as stakingContractCall } from '../../helpers/stakingContract';
import { sendTransaction as stakingSendTransaction } from '../../helpers/stakingContract';
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
  Button
} from '@chakra-ui/react'
const Reward = (props) => {


  useEffect(() => {
    if (web3Store.hasProvider) {
      web3Store.provider.on("accountsChanged", () => {
        console.log("......AccountsChanged")

        window.location.reload();
      })
    }
  });

  const [seed, setSeed] = useState(0)

  const { web3Store, govnStore } = useStores();
  const [inputValue, setInputValue] = useState('');
  const [lockPositions, setLockPositions] = useState([
  ]);

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
      const amountOfRewardsAvailable = await stakingContractCall(
        "getStreamClaimableAmountPerLock",
        [1, web3Store.account, i + 1]
      )
      
      constructedLockPosition = await _createLockPositionObject(
        i + 1,
        amountOfMAINTkn,
        amountOfRewardsAvailable
      )

      console.log("ust this",i,amountOfRewardsAvailable)


      lockPositionsList.push(constructedLockPosition)

    }
    setLockPositions(lockPositionsList)

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
        <TableContainer key={seed}>
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

        <Button type="button"
          onClick={getAllLocks}
        > View Lock Position </Button>

        <Button type="button"
          onClick={handleClaimRewards}
        > Claim Rewards </Button>

        <Button type="button"
          onClick={handleWithdrawRewards}
        > Withdraw Rewards </Button>


      </div>
    </div>
  );
};
//My balance: 504304.394968082 TestToken (Tst)
export default Reward;
