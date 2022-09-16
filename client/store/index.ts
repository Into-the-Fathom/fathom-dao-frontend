import { Web3Store,Web3StoreImpl } from "./web3Store";
import { GovnStoreImpl, GovnStore } from "./govnStore";
import React from "react"
class RootStore {
    web3Store: Web3StoreImpl;
    govnStore: GovnStoreImpl
    constructor() {
        this.web3Store = Web3Store
        this.govnStore = GovnStore
    }
}

const StoresContext = React.createContext(new RootStore());
export const useStores = () => React.useContext(StoresContext);

