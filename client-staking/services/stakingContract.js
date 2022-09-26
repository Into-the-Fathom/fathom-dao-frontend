import { Staking as stakingContractAddress } from "../src/contracts/contract-address.js";
import StakingArtifact from "../src/contracts/Staking.json";
import   { Web3Store } from "../store/web3Store";
import { getNetworkId } from "./base";
import {
    sendTransaction as _sendTransaction,
    makeBatchCall as _makeBatchCall,
    makeCall as _makeCall
  } from "./base";

  let contractInstance;

  const initContractInstance = () => 
    {
      
      let web3 = Web3Store.web3;
      const address = stakingContractAddress.address[getNetworkId()]
      console.log(address)
      contractInstance = new web3.eth.Contract(StakingArtifact.abi, address);
      
    }


    export const sendTransaction = async (methodName, args, options) => {
        console.log(methodName, args, options);
        initContractInstance();
        const method = contractInstance.methods[methodName](...args);
        return await _sendTransaction(method, options);
      };

      export const getAddress = () => {
        initContractInstance();
        return contractInstance.options.address;
      };

      export const makeBatchCall = async methods => {
        initContractInstance();
        return await _makeBatchCall(contractInstance, methods);
      };


      export const makeCall =  async (methodName, args, options) => {
        initContractInstance();
        const method = contractInstance.methods[methodName](...args);
        return await _makeCall(method, options);
      };
