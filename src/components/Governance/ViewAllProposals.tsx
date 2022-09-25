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
import BigNumber from 'bignumber.js';
import { Constants } from '../../helpers/Constants';
import { Link, Button, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';




const AllProposalsView = observer(()  => {
    const { account } = useMetaMask()!
    let logger = useLogger();

    let proposeStore = useStores().proposalStore;

    
    let navigate = useNavigate();

    useEffect(() => {
        logger.log(LogLevel.info,'fetching proposal information.');
        proposeStore.fetchProposals(account) // where is this being used?
    },[]);
  

  return (

  
    <Grid container spacing={3}>
      <Grid item xs={8} md={8} lg={9}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Proposals
            </Typography>
            {proposeStore.fetchedProposals.length === 0 ? 
            <Typography variant='h6'>No proposals available</Typography> : 
            <TableContainer >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Proposal Id Hash:</TableCell>
                    <TableCell>Description:</TableCell>
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
                          {/* <Button onClick={() => {
                            //   navigate(`/proposal/${proposal.proposalId}` as never, {} as never);
                              navigate("/proposal");
                          }}>{proposal.proposalId.substring(0,4) +" ... " +proposal.proposalId.slice(-4)}</Button> */}
                          <Link href={`/proposal/${proposal.proposalId}`} >{proposal.proposalId.substring(0,4) +" ... " +proposal.proposalId.slice(-4)}</Link>
                      </TableCell>
                    
                      <TableCell component="th" scope="row">
                        {proposal.description.substring(0,50) +" ... "}
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
