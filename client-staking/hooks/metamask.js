import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { injected } from './connectors'
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3'
import { useStores } from '../store';
export const MetaMaskContext = React.createContext(null)

export const MetaMaskProvider = ({ children }) => {

    const { web3Store } = useStores()
    const { activate, account, library, connector, active, deactivate } = useWeb3React()

    const [isActive, setIsActive] = useState(false)
    const [shouldDisable, setShouldDisable] = useState(false) // Should disable connect button while connecting to MetaMask
    const [isLoading, setIsLoading] = useState(true)

    //Init Loading
    useEffect(() => {
        connect().then(val => {
            setIsLoading(false)
        })
    }, [])

    // Check when App is Connected or Disconnected to MetaMask
    const handleIsActive = useCallback(() => {
        console.log('App is connected with MetaMask ', active)
        setIsActive(active)
    }, [active])

    useEffect(() => {
        handleIsActive()
    }, [handleIsActive])

    // Connect to MetaMask wallet
    const connect = async () => {
        console.log('Connecting to MetaMask...')
        setShouldDisable(true)
        try {
            await activate(injected).then(() => {
                setShouldDisable(false)

            })
            //await handleWalletConnect()


        } catch (error) {
            console.log('Error on connecting: ', error)
        }
    }

    // Disconnect from Metamask wallet
    const disconnect = async () => {
        console.log('Disconnecting wallet from App...')
        try {
            await deactivate()
        } catch (error) {
            console.log('Error on disconnnect: ', error)
        }
    }
    const handleWalletConnect = async () => {

        const web3 = new Web3(library.givenProvider)

        const accounts = await web3.eth.getAccounts()

        return dispatchStates(accounts[0], library.givenProvider, web3)
    }

    function dispatchStates(account, provider, web3) {
        web3Store.setAccount(account)
        web3Store.setProvider(provider)
        web3Store.setWeb3(web3)
        return { account, web3 }
    }

    const values = useMemo(
        () => ({
            isActive,
            account,
            isLoading,
            connect,
            disconnect,
            shouldDisable,
            handleWalletConnect
        }),
        [isActive, isLoading, shouldDisable, account]
    )




    return <MetaMaskContext.Provider value={values}>{children}</MetaMaskContext.Provider>
}

const useMetaMask = function useMetaMask() {
    const context = React.useContext(MetaMaskContext)

    if (context === undefined) {
        throw new Error('useMetaMask hook must be used with a MetaMaskProvider component')
    }

    return context
}





export default useMetaMask;