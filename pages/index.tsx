import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import classes from '../styles/App.module.css'

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Ethereum dApps Next.js Boiletplate'
  return (
        <Layout>
          <div className={classes.app}>
              <h1>
                Welcome To The FATHOM Staking Platform
              </h1>
          </div>
          <ConnectButton handleOpenModal={onOpen} />
          <AccountModal isOpen={isOpen} onClose={onClose} />
        </Layout>
  )
}

export default Home
