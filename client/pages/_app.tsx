import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '../components/Navigation'
import { AppStoreProvider } from './AppStoreContext'
import { MetaMaskProvider } from '../hooks/metamask'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import { useEffect } from 'react'
import { useStores } from '../store'
import { handleInjectedProvider } from '../lib'
export default function App({ Component, pageProps }: AppProps) {
    const { web3Store } = useStores();
    useEffect(() => {
        console.log(web3Store.hasProvider)
        if(web3Store.hasProvider){
            web3Store.provider.on("accountsChanged", () => {
                console.log("......AccountsChanged")
                //  const handleAccountChanged = async () =>{
                //     const injectedProvider = web3Store.provider;
                //     const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                //     web3Store.setAccount(accounts[0])
                //     const balance = await web3Store.web3.eth.getBalance(accounts[0])
                //     console.log('balance', balance)
                //     web3Store.setEtherBalance(parseInt(balance)/1e18)
                //  }

                //  const result = handleAccountChanged().catch(console.error)
                window.location.reload();
            })
        }
      });
    
    function getLibrary(provider: any, connector: any) {
        return new Web3(provider)
      }
    return (
        //<Web3ReactProvider getLibrary={getLibrary}>
            <ChakraProvider>
                {/* <MetaMaskProvider> */}
                <Navigation>    


                    <Component {...pageProps} />
                </Navigation>
                {/* </MetaMaskProvider> */}
            </ChakraProvider>
           // </Web3ReactProvider>
    )
}
