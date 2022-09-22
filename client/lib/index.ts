import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

import { Web3Store } from '../store/web3Store'




const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID



export async function handleInjectedProvider() {
  const injectedProvider: any = await detectEthereumProvider()
  let provider: any

  if (injectedProvider) {
    console.log(`Injected web3 detected.`)
    provider = injectedProvider
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }
  const web3 = new Web3(provider)
  // REF: https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  
  // The following code seems not working if trigger disconnect from MetaMask Chrome extension
  // provider.on("disconnect", (error: any) => {
  //   Web3Store.clearState()
  //   console.log(error)
  // });
  
  return dispatchStates(accounts[0], provider, web3)
}



function dispatchStates(account: string, provider: any, web3: Web3) {
  console.log('account', account, 'isMetaMask', provider.isMetaMask)
  Web3Store.setAccount(account)
  Web3Store.setProvider(provider)
  Web3Store.setWeb3(web3)
  
  
  return { account, web3 }
}

