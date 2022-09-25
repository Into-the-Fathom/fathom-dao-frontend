import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useStores } from "../../stores";
import {observer} from 'mobx-react'
import useMetaMask from '../../hooks/metamask';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Copyright from '../Footer/Footer';


const ProposeListView = observer(()  => {


  let proposeStore = useStores().proposalStore;

  const [targets, setTargets] = React.useState("");
  const [calldata, setCallDatas] = React.useState("");
  const [values, setValues] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [proposalId, setProposalId] = React.useState(0);


  const { account } = useMetaMask()!

  

  const handleTargetsChange = (e:any) => {
    setTargets(e.target.value)
  }

  const handleCalldataChange = (e:any) => {
    setCallDatas(e.target.value)
  }

  const handleValuesChange = (e:any) => {
    setValues(e.target.value)
  }

  const handleDescriptionChange = (e:any) => {
    setDescription(e.target.value)
  }

  const handleClickPropose = async () => {

    try { 
      var vals = values.trim().split(',').map(Number);

      var caldatas = calldata.trim().split(',')

      var tars = targets.trim().split(",")

      let pId = await proposeStore.createProposal(tars, vals, caldatas, description, account);
      setProposalId(pId);

    } catch (err) {
      console.log(err);
    }
  }

  return (

    <Grid container spacing={3}>
      <Grid item xs={8} md={8} lg={9}>
        <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 490,
        }}
      >

        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Create Proposal
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '95%' },
          }}
          noValidate
          autoComplete="off"
        >
        <div>
        
            <TextField
              id="outlined-multiline-flexible"
              label="Target addresses array"
              multiline
              value={targets}
              maxRows={1}
              onChange={handleTargetsChange}
            />
            </div>
            <div>
            <TextField
              id="outlined-textarea2"
              label="Values array"
              multiline
              value={values}
              maxRows={1}
              onChange={handleValuesChange}
            />
            </div>
            <div>
            <TextField
              id="outlined-multiline-static"
              label="Calldatas array"
              multiline
              value={calldata}
              maxRows={1}
              onChange={handleCalldataChange}
            />
            </div>
            <div>
            <TextField
              id="outlined-textarea"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
            />
        </div>
        <div>
        <Button variant="outlined" onClick={handleClickPropose}>
            Create Proposal
        </Button>
        </div>
        </Box>

        </Paper>

      </Grid>
    </Grid>
  );
})


export default ProposeListView
