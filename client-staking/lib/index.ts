import Web3 from 'web3'

import { Web3Store } from '../store/web3Store'


declare var window: any
async function detectEthereumProvider() {
  if (typeof window !== "undefined") {
    if (window.ethereum) {
  
      // res[0] for fetching a first wallet
      return window.ethereum
        
    } else {
      alert("install metamask extension!!");
    }
  }
  
};


export async function handleInjectedProvider() {


  const injectedProvider: any = await detectEthereumProvider()
  const xdcNetwork = [50,51]

  let provider: any

  if (injectedProvider) {
    console.log(`Injected web3 detected.`)
    provider = injectedProvider
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }
  
  let web3 = new Web3(provider)
  const chainId = await web3.eth.getChainId()
  if (xdcNetwork.includes(chainId)){
    const XDCWeb3 = require('xdc3');
    web3 = new XDCWeb3(provider)

  }
  
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  
 
  return dispatchStates(accounts[0], provider, web3, chainId)
}



function dispatchStates(account: string, provider: any, web3: Web3, chainId: any) {
  console.log('account', account, 'isMetaMask', provider.isMetaMask)
  Web3Store.setAccount(account)
  Web3Store.setProvider(provider)
  Web3Store.setWeb3(web3)
  Web3Store.setChainId(chainId)
  
  return { account, web3 }
}

