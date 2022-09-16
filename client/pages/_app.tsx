import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '../components/Navigation'
import { AppStoreProvider } from './AppStoreContext'
import { MetaMaskProvider } from '../hooks/metamask'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

export default function App({ Component, pageProps }: AppProps) {
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
