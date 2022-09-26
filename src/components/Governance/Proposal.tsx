import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IProposal from "../../stores/interfaces/IProposal"
import BigNumber from 'bignumber.js';
import { Constants } from '../../helpers/Constants';
import TextField from '@mui/material/TextField';

import { Button, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import ButtonGroup from '@mui/material/ButtonGroup';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import { useLogger } from '../../helpers/Logger';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';




const ProposalView = observer(()  => {


    const { account } = useMetaMask()!
    let logger = useLogger();
    let navigate = useNavigate();

    let { _proposalId } = useParams();

    let proposeStore = useStores().proposalStore;


    const handleFor = async () => {

        // (proposalId:string, account:string, support:string)

        try { 
            if ((typeof _proposalId === "string")){
                await proposeStore.castVote(_proposalId, account, "1");
            }

        } catch (err) {
        console.log(err);
        }
    }

    const handleAgainst = async () => {

        // (proposalId:string, account:string, support:string)

        try { 
            if ((typeof _proposalId === "string")){
                await proposeStore.castVote(_proposalId, account, "0");
            }

        } catch (err) {
        console.log(err);
        }
    }

    const handleAbstain = async () => {

        // (proposalId:string, account:string, support:string)

        try { 
            if ((typeof _proposalId === "string")){
                await proposeStore.castVote(_proposalId, account, "2");
            }

        } catch (err) {
        console.log(err);
        }
    }

    function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }

    

    useEffect(() => {

        proposeStore.fetchProposals(account)
        if ((typeof _proposalId === "string")){
            proposeStore.fetchProposal(_proposalId, account)
            proposeStore.fetchProposalState(_proposalId, account)
            proposeStore.fetchProposalVotes(_proposalId, account)
        }
        
    },[]);

    
  

    return (

    <Grid container spacing={5}>
    <Grid item xs={8} md={8} lg={9}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {proposeStore.fetchedProposals.length === 0 ? 
            <Typography variant='h6'>No proposals available  Proposal: {_proposalId}</Typography> : 
            <>
            <Typography component="h2" color="primary" gutterBottom>
                Proposal Id: 
            </Typography>
            <Typography gutterBottom>
                {_proposalId}
            </Typography>
            <Typography component="h2" color="primary" gutterBottom>
                Description: 
            </Typography>

            <Typography gutterBottom>
                {proposeStore.fetchedProposal.description} 
            </Typography>
        </>}
        </Paper >
        </Grid>

        <Grid item xs={3} md={3} lg={3}>      
        
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" color="primary" gutterBottom>
            Proposal State: 
        </Typography>
        <Typography gutterBottom>
            {proposeStore.fetchedProposalState} 
        </Typography>

        <Box sx={{ width: '100%' }}>
            <Typography gutterBottom>
                For: 
            </Typography>
            <LinearProgressWithLabel variant="determinate" value={100*proposeStore.fetchedVotes.forVotes/proposeStore.fetchedTotalVotes} />

            <Typography gutterBottom>
                Against: 
            </Typography>
            <LinearProgressWithLabel variant="determinate" value={100*proposeStore.fetchedVotes.againstVotes/proposeStore.fetchedTotalVotes} />

            <Typography gutterBottom>
                Abstains: 
            </Typography>
            <LinearProgressWithLabel variant="determinate" value={100*proposeStore.fetchedVotes.abstainVotes/proposeStore.fetchedTotalVotes} />
        </Box>  
        

        

        {proposeStore.fetchedProposalState !== "1" ? 
        <>
        <Typography variant='h6'>Voting closed</Typography> 
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={handleFor} disabled={true}>  For  </Button>
            <Button onClick={handleAgainst} disabled={true}>Against</Button>
            <Button onClick={handleAbstain} disabled={true}>Abstain</Button>
        </ButtonGroup>
        
        </>
         : 
        <>
        <Typography variant='h6'>Cast Vote:</Typography> 
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={handleFor}>  For  </Button>
            <Button onClick={handleAgainst}>Against</Button>
            <Button onClick={handleAbstain}>Abstain</Button>
        </ButtonGroup>
        
        </>}
        </Paper>
        </Grid>
    </Grid>
    );
})


export default ProposalView
