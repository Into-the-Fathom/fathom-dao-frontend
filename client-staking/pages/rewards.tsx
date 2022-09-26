import Rewards from '../components/Rewards/Rewards'
import classes from '../styles/App.module.css'
import Layout from '../components/Layout'

import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useStores } from '../store'
import {
  Box
} from "@chakra-ui/react";
function Home() {
  const {web3Store} = useStores();
 

  
  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Ethereum dApps Next.js Boiletplate'
  return (
        <Box className={classes.app}>
            <Box bg='black' w='100%' p={4} color='white' className={classes.parent}>
          <ConnectButton handleOpenModal={onOpen} toDisplay="FATHOM Rewards"/>
      </Box>
          <h1>
                FATHOM Rewards
          </h1>
        <div>
          
            <Rewards
            />
       </div>
       </Box>
  )
}

export default Home
