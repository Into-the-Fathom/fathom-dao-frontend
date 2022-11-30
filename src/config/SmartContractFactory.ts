import { AbiItem } from "web3-utils";
import CollateralPoolConfigAbi from "./ABI/CollateralPoolConfig.json";
import ProxyWalletRegistryAbi from "./ABI/ProxyWalletRegistry.json";
import ProxyWalletAbi from "./ABI/ProxyWallet.json";
import FathomStablecoinProxyActionAbi from "./ABI/FathomStablecoinProxyActions.json";
import BEP20Abi from "./ABI/BEP20.json";
import Addresses from "./addresses.json";

import Governor from './ABI/Governor.json'

export class SmartContractFactory {
  public static Addresses(chainId: number) {
    try {
      let address: any;
      switch (chainId) {
        case 1337:
          address = Addresses["1337"];
          break;
        case 5:
          address = Addresses["5"];
          break;
        case 51:
          address = Addresses["51"];
          break;
        case 50:
          address = Addresses["50"];
          break;
        default:
          address = Addresses["1337"];
          break;
      }
      return address;
    } catch (e) {
      console.error(`Error in fetching address`);
      return {};
    }
  }

  public static PoolConfig(chainId: number) {
    return {
      abi: CollateralPoolConfigAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).collateralPoolConfig,
    }
  };

  public static ProxyWalletRegistry(chainId: number) {
    return {
      abi: ProxyWalletRegistryAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).proxyWalletRegistry,
    }
  };

  public static proxyWallet = {
    abi: ProxyWalletAbi.abi as AbiItem[],
    address: "",
  };

  public static FathomStablecoinProxyAction(chainId: number) {
    return {
      abi: FathomStablecoinProxyActionAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    }
  };

  public static WXDC(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).WXDC,
    }
  };

  public static USDT(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).USDT,
    }
  };

  public static BEP20 = (_address: string) => {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: _address,
    };
  };

  public static FathomStableCoin(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoin,
    }
  };

  public static PositionManager(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).positionManager,
    }
  };

  public static StabilityFeeCollector(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stabilityFeeCollector,
    }
  };

  public static WXDCCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).collateralTokenAdapter,
    }
  };

  public static USDTCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).collateralTokenAdapterUSDT,
    }
  };

  public static StablecoinAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stablecoinAdapter,
    }
  };

  public static AuthtokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).authTokenAdapter,
    }
  };

  public static FathomStablecoinProxyActions(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    }
  };

  public static FathomGovernor(chainId: number)  {
        return {
        abi:Governor.abi as AbiItem [],
        address: SmartContractFactory.Addresses(chainId).fathomGovernor,
    }
  };

}


// import { AbiItem } from 'web3-utils'
// import CollateralPoolConfigAbi from './ABI/CollateralPoolConfig.json'
// import ProxyWalletRegistryAbi from './ABI/ProxyWalletRegistry.json'
// import ProxyWalletAbi from './ABI/ProxyWallet.json'
// import FathomStablecoinProxyActionAbi from './ABI/FathomStablecoinProxyActions.json'
// import Governor from './ABI/Governor.json'
// import BEP20Abi from './ABI/BEP20.json'
// import { useWeb3React } from "@web3-react/core";


// export class SmartContractFactory {



//     public static PoolConfig  = {
//         abi:CollateralPoolConfigAbi.abi as AbiItem [],
//         address:'0x8aEE29EaA4CE75FA53A7F63EEDA722aADaa21DC9'
//     }

//     public static ProxyWalletRegistry  = {
//         abi:ProxyWalletRegistryAbi.abi as AbiItem [],
//         address:'0x79A63218AA430D9587De5Ccc8484D6cFd61DC02e'
//     }

//     public static proxyWallet  = {
//         abi:ProxyWalletAbi.abi as AbiItem [],
//         address:''
//     }

//     public static FathomStablecoinProxyAction  = {
//         abi:FathomStablecoinProxyActionAbi.abi as AbiItem [],
//         address:'0x8598b178d5e6C40Cb5800De5522184092469b40C'
//     }

//     public static WXDC  = {
//         abi:BEP20Abi.abi as AbiItem [],
//         address:'0xc36b26cf999F9f4A085Ce5bD1A541a4B81a70753'
//     }

//     public static PositionManager  = {
//         abi:[],
//         address:'0xADd9227440f4BB447142b6df006016EA7c0773ba'
//     }

//     public static StabilityFeeCollector  = {
//         abi:[],
//         address:'0x0Cdd5Ba91fe821BCa30f901E5805dcDc2d5c2Aa4'
//     }

//     public static CollateralTokenAdapter  = {
//         abi:[],
//         address:'0x1A3f51fAA7d76eB482FFC22aec67152A46E0f1dd'
//     }

//     public static StablecoinAdapter  = {
//         abi:[],
//         address:'0xfA104bC5010410a03d2846c04373093Ca709c4C6'
//     }

//     public static FathomStablecoinProxyActions  = {
//         abi:[],
//         address:'0x8598b178d5e6C40Cb5800De5522184092469b40C'
//     }

//     // // Ganache
//     // public static FathomGovernor  = {
//     //     abi:Governor.abi as AbiItem [],
//     //     address:'0xc36b26cf999F9f4A085Ce5bD1A541a4B81a70753'
//     // }

//     // Goerli
//     // public  FathomGovernor  = this.returnConfig();

//     // if (chainId === 51){    
//         // Apothem
//         public static FathomGovernor  = {
//             abi:Governor.abi as AbiItem [],
//             address:'0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
//         }


// }