import Staking from '../components/Staking/Staking'
import classes from '../styles/App.module.css'

import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import Unstaking from '../components/Unstaking/Unstaking'
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

  const inputHandler = () => {
    console.log("ran")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Ethereum dApps Next.js Boiletplate'
  return (

    <div className={classes.app}>

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
        FATHOM Staking
      </h1>
      <div>

        <Staking
          account={"account"}
          totalStaked={"00"}
          myStake={"00"}
          userBalance={"00"}
          unStakeHandler={"00"}
          stakeHandler={stakeHandler}
          inputHandler={inputHandler}
          apy={0}
          page={1}
        />

      
      </div>
    </div>
  )
}

export default Home
