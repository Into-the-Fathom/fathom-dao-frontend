import React, { Fragment, useState } from 'react'
import UnlockRows from './UnlockRows';
import { observer } from "mobx-react";
import { useStores } from '../../store';
import { Box } from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
  } from '@chakra-ui/react'
  

const Unstaking = observer(({lockPositions, handleUnlock,handleEarlyUnlock}) => {
    const [seed, setSeed] = useState(1);
       
    const {web3Store, govnStore} = useStores();


    return (
        <Box>
            <TableContainer key={seed}>
                <Table>
                <Thead>
                    <Tr>
                        <Th>
                            Token Balance
                        </Th>
                        <Th>
                            VOTE Tokens Received
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
                            lockPosition={lockPosition}
                            handleUnlock = {handleUnlock}
                            handleEarlyUnlock={handleEarlyUnlock}
                        />
                    })}
                    
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
})

export default Unstaking
 