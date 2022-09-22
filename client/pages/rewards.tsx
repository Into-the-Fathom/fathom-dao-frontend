import Rewards from '../components/Rewards/Rewards'
import classes from '../styles/App.module.css'
import Layout from '../components/Layout'

import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'

import {
  Box
} from "@chakra-ui/react";
function Home() {
  const stakeHandler = () => {
    console.log("ran")
  }

  const changePage = () => {
    console.log("")
  }

  const claimAllRewards = () => {
    console.log("ran")
  }

  const claimRewards = () => {
    console.log("ran")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Ethereum dApps Next.js Boiletplate'
  return (
        <Box className={classes.app}>
          
          <Box as="main" p="4">
          {/* Add content here, remove div below  */}
          <Box borderWidth="0" borderStyle="dashed" rounded="md" h="10" />
       </Box>
        <ConnectButton handleOpenModal={onOpen} />

        <AccountModal isOpen={isOpen} onClose={onClose} />
        <Box as="main" p="4">
          {/* Add content here, remove div below  */}
          <Box borderWidth="0" borderStyle="dashed" rounded="md" h="20" />
       </Box>
          <h1>
                FATHOM Rewards
          </h1>
        <div>
          
            <Rewards
              account={"account"}
              totalStaked={"00"}
              myStake={"00"}
              userBalance={"00"}
              unStakeHandler={"00"}
              claimAllRewards={claimAllRewards}
              claimRewards={claimRewards}
              apy={0}
              page={1}
            />
       </div>
       </Box>
  )
}

export default Home
