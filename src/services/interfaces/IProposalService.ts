import IProposal from "../../stores/interfaces/IProposal";
import IVoteCounts from "../../stores/interfaces/IVoteCounts";

export default interface IProposalService{
    createProposal(targets:string[], values:number[], calldatas:string[], description:string, account:string): Promise<number>;

    viewAllProposals(account:string): Promise<IProposal[]>

    viewProposal(proposalId:string, account:string): Promise<IProposal>

    viewProposalState(proposalId:string, account:string): Promise<string>

    viewVoteCounts(proposalId:string, account:string): Promise<IVoteCounts>

    castVote(proposalId:string, account:string, support:string): Promise<number>
}