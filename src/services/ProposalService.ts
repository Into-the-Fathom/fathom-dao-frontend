import Web3 from "web3";
import { SmartContractFactory } from "../config/SmartContractFactory";
import IProposalService from "./interfaces/IProposalService";
import { Web3Utils } from "../helpers/Web3Utils";
import IProposal from "../stores/interfaces/IProposal";
import IVoteCounts from "../stores/interfaces/IVoteCounts";

export default class ProposalService implements IProposalService{

    async createProposal(targets:string[], values:number[], calldatas:string[], description:string, account:string): Promise<number>{
        const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)
        return await FathomGovernor.methods.propose(
            targets, 
            values, 
            calldatas, 
            description
        ).send({from:account})
    }


    async viewAllProposals(account:string): Promise<IProposal[]>{
        let fetchedProposals:IProposal[] = [];
        try{
            const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)

            var proposalIds = await FathomGovernor.methods.getProposalIds().call();
            console.log(typeof proposalIds[0])
            var descriptions:any = [];

            for (let i = 0; i < proposalIds.length; i++) {
                descriptions.push(await FathomGovernor.methods.getDescription(proposalIds[i]).call({from:account}));

                let proposal = {description:descriptions[i], proposalId:proposalIds[i]}
                fetchedProposals.push(proposal);
            }
            
            return fetchedProposals

        } catch(e) {
            console.error(`Error in getting Proposals: ${e}`)
            return fetchedProposals;
        }
    }


    async viewProposal(proposalId:string, account:string): Promise<IProposal>{
        let proposal = {} as IProposal;
        try{
            const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)

            let description = await FathomGovernor.methods.getDescription(proposalId).call({from:account})

            proposal = {description:description, proposalId:proposalId}
    
            return proposal

        } catch(e) {
            console.error(`Error in getting Proposals: ${e}`)
            return proposal;
        }
    }

    async viewProposalState(proposalId:string, account:string): Promise<string>{
        let proposalState = "";
        try{
            const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)

            proposalState = await FathomGovernor.methods.state(proposalId).call({from:account})

            return proposalState
        } catch(e) {
            console.error(`Error in getting Proposals: ${e}`)
            return proposalState;
        }
    }

    async viewVoteCounts(proposalId:string, account:string): Promise<IVoteCounts>{
        let proposalVotes = {} as IVoteCounts;
        try{
            const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)

            proposalVotes = await FathomGovernor.methods.proposalVotes(proposalId).call({from:account})

            return proposalVotes
        } catch(e) {
            console.error(`Error in getting Proposals: ${e}`)
            return proposalVotes;
        }
    }

    async castVote(proposalId:string, account:string, support:string): Promise<number> {
        let weight = 0
        try{
            const FathomGovernor = Web3Utils.getContractInstance(SmartContractFactory.FathomGovernor)

            weight = await FathomGovernor.methods.castVote(proposalId, support).send({from:account})
            return weight;

        } catch(e) {
            console.error(`Error in getting Proposals: ${e}`)
            return weight;
        }
    }


}


