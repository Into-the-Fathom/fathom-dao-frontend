import { Button, Box, Text, SimpleGrid } from "@chakra-ui/react";
import { handleInjectedProvider, handleWalletConnect } from "../lib";
import { useContext, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader'
import { Web3Store } from '../store/web3Store'


type Props = {
  handleOpenModal: any
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const [ etherBalance, setEtherBalance ] = useState(0)
  const [ loading, setLoading ] = useState(false)

  async function handleConnectWallet(wallet: string)  {
    setLoading(true)
    try {
      const { account, web3 } =  await handleInjectedProvider()
      const balance = await web3.eth.getBalance(account)
      console.log('balance', balance)
      setEtherBalance(parseInt(balance)/1e18)
    } catch (error) {
      console.error(error)  
    } finally {
       setLoading(false)
    }
  }
  // console.log('Web3Store', Web3Store)
  return Web3Store.account ? (
    <Box
      mt={3}
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {etherBalance.toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {Web3Store.account &&
            `${Web3Store.account.slice(0, 6)}...${Web3Store.account.slice(
              Web3Store.account.length - 4,
              Web3Store.account.length
            )}`}
        </Text>
      </Button>
    </Box>
  ) : (
    <SimpleGrid mt={3} columns={2} spacing={3}>
      <Button
        isLoading={loading}
        spinner={<BeatLoader size={8} color="white" />}
        onClick={() => handleConnectWallet('MetaMask')}
        bg="blue.800"
        color="blue.300"
        fontSize="lg"
        fontWeight="medium"
        borderRadius="xl"
        border="1px solid transparent"
        _hover={{
          borderColor: "blue.700",
          color: "blue.400",
        }}
        _active={{
          backgroundColor: "blue.800",
          borderColor: "blue.700",
        }}
      >
        Connect with MetaMask
      </Button>

    </SimpleGrid>
  );
}
