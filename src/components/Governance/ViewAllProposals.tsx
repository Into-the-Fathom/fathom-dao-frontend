import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useStores } from '../../stores';
import useMetaMask from '../../hooks/metamask';
import { LogLevel, useLogger } from '../../helpers/Logger';
import IProposal from "../../stores/interfaces/IProposal"
import { Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import {useNavigate, Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { useWeb3React } from '@web3-react/core';




const AllProposalsView = observer(()  => {
    const { account } = useMetaMask()!
    const { chainId } = useWeb3React()!
    let logger = useLogger();

    let proposeStore = useStores().proposalStore;

    
    let navigate = useNavigate();

    useEffect(() => {
        logger.log(LogLevel.info,'fetching proposal information.');
        if (chainId){
          proposeStore.fetchProposals(account, chainId) 
          
        }
    },[]);
  

  return (

  
    <Grid container spacing={3}>
      <Grid item xs={8} md={8} lg={9}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Proposals
            </Typography>
            {proposeStore.fetchedProposals.length === 0 ? 
            <Typography variant='h6'>Loading all proposals</Typography> : 
            <TableContainer >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Proposal Id Hash:</TableCell>
                    <TableCell>Title:</TableCell>
                    <TableCell>Status:</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proposeStore.fetchedProposals.map((proposal:IProposal) => (
                    <TableRow
                      key={proposal.proposalId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                          <Link to={`/proposal/${proposal.proposalId}`} >{proposal.proposalId.substring(0,4) +" ... " +proposal.proposalId.slice(-4)}</Link>
                      </TableCell>
                    
                      <TableCell component="th" scope="row">
                        {proposal.description.split('----------------')[0].substring(0,50) +" ... "}
                      </TableCell>
                    
                      <TableCell component="th" scope="row">
                        {proposal.status}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            }
            </Paper>

        </Grid>
        </Grid>



  );
})


export default AllProposalsView
