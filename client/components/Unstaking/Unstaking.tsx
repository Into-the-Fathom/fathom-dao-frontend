import React, { Fragment, useState } from 'react'
import classes from "../../styles/Staking.module.css";
import { Button } from '@chakra-ui/react';
import {sendTransaction as stakingTransactions} from "../../helpers/stakingContract.js";
import UnlockRows from './UnlockRows';
import contractAddress from "../../src/contracts/contract-address.json"
import { observer } from "mobx-react";
import { useStores } from '../../store';
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
  

const Unstaking = observer(({lockPositions, getAllLocks, handleUnlock}) => {
    const [seed, setSeed] = useState(1);
       
    const {web3Store, govnStore} = useStores();
    
    const getTimeStamp = async () => {
    
        var blockNumber = await web3Store.web3.eth.getBlockNumber();
        var block =  await web3Store.web3.eth.getBlock(blockNumber);
    
        var timestamp = block.timestamp
        return timestamp;
      }
    
    

    


    return (
        <div>
            <TableContainer key={seed}>
                <Table>
                <Thead>
                    <Tr>
                        <Th>
                            Token Balance
                        </Th>
                        <Th>
                            VOTE Tokens
                        </Th>
                        <Th>
                            Remaining Period
                        </Th>
                    </Tr>
                </Thead>
                    <Tbody>
                        
                      
                    {

                    lockPositions.map((lockPosition) => {
                        return <UnlockRows
                            getAllLocks={getAllLocks}
                            lockPosition={lockPosition}
                            handleUnlock = {handleUnlock}
                        />
                    })}
                    
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
})

export default Unstaking
 