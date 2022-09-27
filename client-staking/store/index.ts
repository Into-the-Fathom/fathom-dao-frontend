import { Web3Store,Web3StoreImpl } from "./web3Store";
import { GovnStoreImpl, GovnStore } from "./govnStore";
import { StakingStoreImpl, StakingStore } from "./stakingStore";

import React from "react"
export class RootStore {
    web3Store: Web3StoreImpl;
    govnStore: GovnStoreImpl;
    stakingStore: StakingStoreImpl;
    constructor() {
        this.web3Store = Web3Store
        this.govnStore = GovnStore
        this.stakingStore = StakingStore;
    }
}

const StoresContext = React.createContext(new RootStore());
export const useStores = () => React.useContext(StoresContext);

