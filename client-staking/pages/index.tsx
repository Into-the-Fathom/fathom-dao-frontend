import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import classes from '../styles/App.module.css'
import { useColorMode } from '@chakra-ui/color-mode'
import React from 'react'
import { useEffect } from 'react'
import { useStores } from '../store'
import {
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/button'


function Home() {
  const { web3Store } = useStores();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  

  return (

        <Layout>
          <div className={classes.app}>
           
              <h1>
            
                Welcome To The FATHOM Staking Platform
              </h1>


          </div>

          <ConnectButton handleOpenModal={onOpen} toDisplay="" />
        </Layout>
  )
}

export default Home
