import { action, computed, makeObservable, observable } from "mobx";

export class Web3StoreImpl{
    
    account: any = null;
    provider: any = null;
    web3: any = null;

    constructor() {
        makeObservable(this, {
            account: observable,
            provider: observable,
            web3: observable,
            setAccount: action,
            setProvider: action,
            setWeb3: action
        });
    }  

    setAccount(account: string){
        this.account = account;
    }

    setProvider(provider: any){
        this.provider = provider;
    }

    setWeb3(web3: any){
        this.web3 = web3;
    }

    clearState(){
        this.account = null
        this.provider = null
        this.web3 = null
    }

}

export const Web3Store = new Web3StoreImpl();