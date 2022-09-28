import { action, computed, makeObservable, observable, runInAction } from "mobx";


export class StakingStoreImpl{
    
    totalStakedBalance: any = null;
    totalWalletBalance: any = null;
    lockPositions: any = [];
    apr: any = null;
    constructor() {
        makeObservable(this, {
            totalStakedBalance: observable,
            totalWalletBalance: observable,
            apr: observable,
            lockPositions: observable,
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


    setLockPositions(lockPositions: any){
        runInAction(() => {
            this.lockPositions = lockPositions;
        })
        
    }

    setAPR(apr: any){
        this.apr = apr;
    }

}

export const StakingStore = new StakingStoreImpl();