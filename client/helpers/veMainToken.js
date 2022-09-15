import contractAddress from "../src/contracts/contract-address.json"
import VeMainTokenArtifact from "../src/contracts/VeMainToken.json";
import { Web3Store } from "../store/web3Store";
import {
    sendTransaction as _sendTransaction,
    makeBatchCall as _makeBatchCall,
  } from "./base";

  let contractInstance;

  const initContractInstance = () => 
    {
      console.log(Web3Store.web3)
      let web3 = Web3Store.web3;
      const address = contractAddress.VeMainToken
      contractInstance = new web3.eth.Contract(VeMainTokenArtifact.abi, address);
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

      // export const makeCall = async method => {
      //   initContractInstance();
      //   return await _makeCall(contractInstance, method);
      // };
