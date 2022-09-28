// src/stores/index.js

import React from "react";
import ProposalService from "../services/ProposalService";
import AuthStore from "./auth.store";
import PoolStore from "./pool.store";
import PositionStore from "./positions.store";
import ProposalStore from "./proposal.store";

import ActiveWeb3TransactionsService from "../services/ActiveWeb3TransactionsService";
import ActiveWeb3Transactions from "./transaction.store";


export class RootStore {
  authStore: AuthStore;
  proposalStore: ProposalStore;
  transactionStore: ActiveWeb3Transactions;
  
  constructor() {
    this.authStore = new AuthStore(this)
    this.proposalStore = new ProposalStore(this, new ProposalService())
    this.transactionStore = new ActiveWeb3Transactions(this, new ActiveWeb3TransactionsService())
 
  }
}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
