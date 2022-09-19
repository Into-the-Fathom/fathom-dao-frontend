export const ETHEREUM = {
    REQUEST_ACCOUNT: "eth_requestAccounts",
    CURRENT_ACCOUNT: "eth_accounts",
    ON_ACCOUNT_CHANGED: "accountsChanged",
    ON_DISCONNECT: "disconnect",
    ON_CONNECT: "connect",
  };
  
  export const API_STATE = {
    LOADING: "LOADING",
    UPDATING: "UPDATING",
    INITIAL: "INITIAL",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
  };
  
  export const STATE_MUTABILITY_TYPES = {
    NONPAYABLE: "nonpayable",
    PAYABLE: "payable",
    PURE: "pure",
    VIEW: "view",
  };
  
  export const METHOD_TYPES = {
    FUNCTION: "function",
    CONSTRUCTOR: "constructor",
    EVENT: "event",
  };