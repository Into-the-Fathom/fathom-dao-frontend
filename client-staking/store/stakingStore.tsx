import { action, computed, makeObservable, observable } from "mobx";


export class StakingStoreImpl{
    
    totalStakedBalance: any = null;
    totalWalletBalance: any = null;
    apr: any = null;
    constructor() {
        makeObservable(this, {
            totalStakedBalance: observable,
            totalWalletBalance: observable,
            apr: observable,
            setTotalStakedBalance: action,
            setTotalWalletBalance: action,
            setAPR: action
        });
    }  

    setTotalStakedBalance(totalStakedBalance: any){
        this.totalStakedBalance = totalStakedBalance;
    }

    setTotalWalletBalance(totalWalletBalance: any){
        this.totalWalletBalance = totalWalletBalance;
    }

    setAPR(apr: any){
        this.apr = apr;
    }

}

export const StakingStore = new StakingStoreImpl();