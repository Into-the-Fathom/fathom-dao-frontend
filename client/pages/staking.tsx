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

    <Box className={classes.app}>
      <ConnectButton handleOpenModal={onOpen} />

      <AccountModal isOpen={isOpen} onClose={onClose} />
      <Box as="main" p="4">
        {/* Add content here, remove div below  */}
        <Box borderWidth="0" borderStyle="dashed" rounded="md" h="5" />
      </Box>
      {/* .app h1 {
  font-size: 2em;
  border-left: 5px solid dodgerblue;
  padding: 10px;
  letter-spacing: 5px;
  margin-bottom: 40px;
  font-weight: bold;
  padding-left: 10px;
} */}
      <Box
      padding='10px'
      paddingLeft='10px'
      letterSpacing= '5px'
      fontSize='2em'
      marginBottom='40px'
      fontWeight='bold'
      >
        FATHOM Staking
      </Box>
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
    </Box>
  )
}

export default Home
