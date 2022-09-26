import { action, computed, makeObservable, observable, runInAction } from "mobx";
import _isUndefined from "lodash/isUndefined";

export class Web3StoreImpl{
    
    account: any = null;
    provider: any = undefined;
    web3: any = null;
    etherBalance: any = 0;
    chainId: any = 1;

    constructor() {
        makeObservable(this, {
            account: observable,
            provider: observable,
            etherBalance: observable,
            web3: observable,
            chainId: observable,
            accountConnected: computed,
            hasProvider: computed,
            setAccount: action,
            setProvider: action,
            setWeb3: action,
            setEtherBalance: action
        });
        //this.onAccountsChanged(this.handleInjectedProvider);
    }  

    setAccount(account: string){
        this.account = account;
    }

    setProvider(provider: any){
        this.provider = provider;
    }

    setEtherBalance(etherBalance: any) {
        this.etherBalance = etherBalance
    }

    setWeb3(web3: any){
        this.web3 = web3;
    }

    setChainId(chainId: any){
        this.chainId = chainId
    }

    get accountConnected() {
        return this.account != null
    }

    clearState(){
        this.account = null
        this.provider = null
        this.web3 = null
    }


//   async promptWalletSignIn() {
//     try {
//       if (!this.hasProvider) throw new Error("client does not have Metamask");
//       const accounts = await this.provider.request({
//         method: ETHEREUM.REQUEST_ACCOUNT,
//       });
//       this.setAccount(accounts);
//     } catch (err) {
//       console.error(err);
//     }
//   }

     

  get hasProvider(): boolean {
    return !_isUndefined(this.provider);
  }

  async onAccountsChanged (effect: () => any) {
    this.provider.on("accountsChanged", effect);
    
  }
}

export const Web3Store = new Web3StoreImpl();