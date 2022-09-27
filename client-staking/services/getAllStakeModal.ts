
import { toWei, fromWei, toBN } from '../services/base';
import { makeCall as stakingGetterCall } from '../services/stakingGetter';
import { makeCall as veMainTokenCall } from '../services/veMainToken.js';
import { makeCall as stakingContractCall } from '../services/stakingContract.js';
//import { Web3Store } from '../../store/web3Store';
import { Web3Store } from '../store/web3Store';
import { StakingStore } from '../store/stakingStore';
import { GovnStore } from '../store/govnStore';
import { isInteger, toInteger } from 'lodash';
import { makeCall as mainTokenCall } from '../services/mainToken.js';
const _convertToEtherBalance =  (balance) => {
    return parseFloat(fromWei(balance)).toFixed(0)
  }
const getAllLocks = async () => {
  const web3Store = Web3Store;
  const stakingStore = StakingStore;
    let totalStakedPosition = toBN("0")

    let result = await stakingGetterCall(
      "getLocksLength",
      [web3Store.account],
    )
    console.log(result)

    
    for (let i = 0; i < toInteger(result); i++) {

      const { 0: amountOfMAINTkn, 1: amountOfveMAINTkn, 2: mainTknShares, 3: positionStreamShares, 4: end, 5: owner } =
        await stakingGetterCall(
          "getLock",
          [web3Store.account, i + 1]
        )

       
      totalStakedPosition = totalStakedPosition.add(toBN(amountOfMAINTkn))

    }
    const totalStakedPositionToEther = _convertToEtherBalance(totalStakedPosition)
    stakingStore.setTotalStakedBalance(totalStakedPositionToEther)
  }

  const getWalletBalance = async () => {
    const web3Store = Web3Store;
  const stakingStore = StakingStore;
    const walletBalance = await mainTokenCall(
      "balanceOf",
      [web3Store.account]
    )
      stakingStore.setTotalWalletBalance(_convertToEtherBalance(walletBalance).toString())
  }

  const getVoteBalance = async () => {
    const web3Store = Web3Store;
    const govnStore = GovnStore;
    const beforeVOTETokenBalance = _voteTokenBalance
    let result = await veMainTokenCall(
      "balanceOf",
      [web3Store.account]
    )

    var _voteTokenBalance = result.toString()
    if(parseInt(_voteTokenBalance) > 0){
      govnStore.setVoteTokeBalance(_convertToEtherBalance(_voteTokenBalance))
    }else{
      govnStore.setVoteTokeBalance(0)
    }
    ///@notice: This is for frontend so that marginal vote release is not displayed

  }


  const getOneDayRewardForStream1 = () => {
    const now = Math.floor(Date.now() / 1000)
    const oneDay = 86400
    const oneYear = 365 * 24 * 60 * 60
    const streamStart = 2000
    const streamEnd = 0
  
    const oneDayReward = 20000 * oneDay / oneYear;
    return oneDayReward
  }
  
  const getAPR = async () => {
    const web3Store = Web3Store;
    const stakingStore = StakingStore;
    if (web3Store.hasProvider){
    const oneYear = 365 * 24 * 60 * 60
    const oneDayReward = getOneDayRewardForStream1()
    const oneYearStreamRewardValue = oneDayReward * 365;
    const totalStaked =  await stakingContractCall(
      "totalAmountOfStakedMAINTkn",
      []
    );
    
    let totalAPR = oneYearStreamRewardValue * 100 / fromWei(totalStaked,"ether");
    const APR = parseInt(totalAPR.toString())
    stakingStore.setAPR(APR)
      
    }

    
  }

  export const  loadAll = async () => {
    await getAllLocks()
     await getAPR()
     await getWalletBalance()
     await getVoteBalance()
   }
 

