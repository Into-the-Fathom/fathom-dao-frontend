import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '../components/Navigation'
import { useEffect } from 'react'
import { useStores } from '../store'
import { useColorMode } from '@chakra-ui/color-mode'
import theme from '../theme/theme'


export default function App({ Component, pageProps }: AppProps) {
    const { web3Store } = useStores();
    const { colorMode, toggleColorMode } = useColorMode()

   
    //   <Button onClick={toggleColorMode}>
    //     Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    //   </Button>



      function ForceDarkMode(props: { children: JSX.Element }) {
        const { colorMode, toggleColorMode } = useColorMode();
      
        useEffect(() => {
          if (colorMode === "dark") return;
          toggleColorMode();
        }, [colorMode]);
      
        return props.children;
      }
      
    
    
    return (
        //<Web3ReactProvider getLibrary={getLibrary}>
            
            <ChakraProvider theme={theme}>
                <ForceDarkMode>
                {/* <MetaMaskProvider> */}
                <Navigation>    


                    <Component {...pageProps} />
                </Navigation>
                </ForceDarkMode>
                {/* </MetaMaskProvider> */}
            </ChakraProvider>
    )
}
