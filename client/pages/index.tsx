import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import classes from '../styles/App.module.css'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useColorMode } from '@chakra-ui/color-mode'
import React from 'react'
import {  Heading } from '@chakra-ui/layout'
import {
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/button'


function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()



  return (
    
        <Layout>
          <div className={classes.app}>
              <h1>
                Welcome To The FATHOM Staking Platform
              </h1>


          </div>
          <IconButton mt={4} aria-label="Toggle Mode" onClick={toggleColorMode}>
          { colorMode === 'light' ? <MoonIcon/> : <SunIcon/> }
        </IconButton>
          <ConnectButton handleOpenModal={onOpen} />
          <AccountModal isOpen={isOpen} onClose={onClose} />
        </Layout>
  )
}

export default Home
