import { Button, Box, Text, SimpleGrid } from "@chakra-ui/react";
import { handleInjectedProvider } from "../lib";
import { useContext, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader'
import { useStores } from '../store';
import { observer} from 'mobx-react'
type Props = {
  handleOpenModal: any
};

const ConnectButton = observer(({handleOpenModal}) =>{

  const { web3Store } = useStores();
  const [ loading, setLoading ] = useState(false)

  async function handleConnectWallet(wallet: string)  {
    setLoading(true)
    try {
      const { account, web3 } =  await handleInjectedProvider()
      const balance = await web3.eth.getBalance(account)
      console.log('balance', balance)
      web3Store.setEtherBalance(parseInt(balance)/1e18)
    } catch (error) {
      console.error(error)  
    } finally {
       setLoading(false)
    }
  }
  // console.log('Web3Store', Web3Store)
  return web3Store.account ? (
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
          {web3Store.etherBalance.toFixed(3)} ETH
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
          {web3Store.account}
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
);

export default ConnectButton