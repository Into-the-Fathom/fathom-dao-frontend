import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '../components/Navigation'


export default function App({ Component, pageProps }: AppProps) {
    return (
            <ChakraProvider>
                <Navigation>
                    <Component {...pageProps} />
                </Navigation>
            </ChakraProvider>
    )
}
