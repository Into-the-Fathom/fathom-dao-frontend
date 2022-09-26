/* eslint-disable */
// import networkConfig from "@/config/networkConfig";

// const rightNetworks = networkConfig.rightNetworks;
// const defaultNetwork = networkConfig.defaultNetwork;

let alert;
 
import { Web3Store } from '../store/web3Store';
const web3 = Web3Store.web3;

// if (process.browser) {
//   window.onNuxtReady(({ $store }) => {
//     console.log($store);
//     store = $store;
//   });
// }

export const sendTransaction = async (method, options) => {
  return new Promise(async (resolve, reject) => {

    const accountConnected = Web3Store.accountConnected;
    //console.log(accountConnected, isRightNetwork);
    if (!accountConnected) {
      console.log(
        "Account not connected. Please check your connection or try re-connecting your wallet. ",
        "Notification",
        {
          confirmButtonText: "OK",
          confirmButtonClass: "confirm-button"
        }
      );
      return resolve(false);
    }
   

    const gasPriceInWei = await getGasPrice();
    // const estimatedGas = await estimateGas(method, options.from, gasPriceInWei * 20);
    //
    Object.assign(options, {
      gasPrice: toHex(gasPriceInWei)
      // gasLimit: estimatedGas,
    });
    //
    await method
      .send(options)
      .on("sending", sending => {})
      .on("receipt", receipt => {
        resolve(receipt);
      })
      .on("error", (error, receipt) => {
        if (error.code === 4001) {
          console.log(error.message)
          resolve();
        } else {
            console.log(error.message)
            resolve();
        }
      });
  });
};

export const getNetworkId = () => {
  const web3 = Web3Store.web3;
  if(Web3Store.hasProvider){
    if (web3.givenProvider) {
      const currentProvidersNetwork = 
        parseInt(web3.givenProvider.chainId).toString();
    
    return currentProvidersNetwork;
    }
  }else {
    console.log("Please connect your metamask")
  }
}

export const getEvents = async (contractInstance, eventName, fromBlock) => {
  try {
    const events = await contractInstance.getPastEvents(eventName, {
      fromBlock,
      toBlock: "latest"
    });
    return events;
  } catch (error) {
    console.log("error:", error);
  }
};

export const makeBatchRequest = (calls, callFrom) => {
  let batch = new web3.BatchRequest();
  let promises = calls.map(call => {
    return new Promise((resolve, reject) => {
      let request = call.request(
        {
          from: callFrom
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
      batch.add(request);
    });
  });

  batch.execute();

  return Promise.all(promises);
};

/**
 * @desc calls contract functions
 * @param contractInstance
 * @param methods {
 *   methodName - name of method,
 *   args[] - method's arguments,
 *   opts - additional options
 * }
 * @return array - contract methods info
 */
export const makeBatchCall = async (contractInstance, methods) => {
  const result = [];
  await Promise.all(
    methods.map(async method => {
      let methodToCall;
      if (method.args) {
        methodToCall = contractInstance.methods[method.methodName].apply(
          null,
          method.args
        );
      } else {
        methodToCall = contractInstance.methods[method.methodName]();
      }

      const response = await methodToCall.call(method.opts);
      console.log(response)
      result.push(response);
    })
  );

};


export const makeCall = async (method, options) => {
      const result = await method.call(options)
      return result
}
const estimateGas = (method, from, gas) => {
  return new Promise((resolve, reject) => {
    method.estimateGas(
      {
        from,
        gas
      },
      (err, gasAmount) => {
        if (!err) {
          return resolve(gasAmount);
        }
        return reject(err);
      }
    );
  });
};

export const getTransactionDetail = async transactionHash => {
  try {
    const transactionDetail = await web3.eth.getTransaction(transactionHash);
    return transactionDetail;
  } catch (error) {
    console.log("error:", error);
  }
};

// export const getNetworkId = () => {
//   if (web3.givenProvider) {
//     const currentProvidersNetwork = parseInt(
//       web3.givenProvider.chainId || web3.givenProvider.networkVersion
//     );
//     const isRightNetwork = rightNetworks.includes(currentProvidersNetwork);
//     if (isRightNetwork) {
//       return currentProvidersNetwork;
//     }
//   }
//   return defaultNetwork;
// };

export const isContractExists = async contractAddress => {
  const web3 = Web3Store.web3;
  try {
    const code = await web3.eth.getCode(contractAddress);

    return code !== "0x";
  } catch {}
};

export const isAddress = address => {
  const web3 = Web3Store.web3;
  return web3.utils.isAddress(address);
};

export const toWei = (amount, unit) => {
  const web3 = Web3Store.web3;
  return web3.utils.toWei(amount.toString(), unit);
};

export const fromWei = (amount, unit = "ether") => {
  const web3 = Web3Store.web3;
  return web3.utils.fromWei(amount.toString(), unit);
};

export const toHex = value => {
  const web3 = Web3Store.web3;
  return web3.utils.toHex(value);
};

export const numberToHex = number => {
  const web3 = Web3Store.web3;
  return web3.utils.numberToHex(`${number}`);
};

export const getGasPrice = async () => {
  const web3 = Web3Store.web3;
  return await web3.eth.getGasPrice();
};
