import { action, computed, makeObservable, observable } from "mobx";


export class GovnStoreImpl{
    
    voteTokenBalance: any = null;

    constructor() {
        makeObservable(this, {
            voteTokenBalance: observable,
            setVoteTokeBalance: action
        });
    }  

    setVoteTokeBalance(voteTokenBalance: any){
        this.voteTokenBalance = voteTokenBalance;
    }
}

export const GovnStore = new GovnStoreImpl();