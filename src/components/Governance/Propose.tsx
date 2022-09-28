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
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import {Constants} from "../../helpers/Constants"
import { useWeb3React } from '@web3-react/core';


const ProposeListView = observer(()  => {


  let proposeStore = useStores().proposalStore;

  const [targets, setTargets] = React.useState("");
  const [calldata, setCallDatas] = React.useState("");
  const [values, setValues] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [description_title, setDescription_title] = React.useState("");
  const [proposalId, setProposalId] = React.useState(0);
  const [isFirstChecked, setIsFirstChecked] = React.useState(false);
  const [isSecondChecked, setIsSecondChecked] = React.useState(false);

  const { account } = useMetaMask()!


  const { chainId } = useWeb3React()!

  

  

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

  const handleDescriptionTitleChange = (e:any) => {
    setDescription_title(e.target.value)
  }

  const handleClickPropose = async () => {

    try { 

      if (isFirstChecked && chainId){
        
        var vals = values.trim().split(',').map(Number);

        var caldatas = calldata.trim().split(',')
  
        var tars = targets.trim().split(",")

        var combined_text = description_title + '    ----------------    ' + description
  
        let pId = await proposeStore.createProposal(tars, vals, caldatas, combined_text, account, chainId);
        setProposalId(pId);

      } else {

        var combined_text = description_title + '    ----------------    ' + description
        if(chainId){
          let pId = await proposeStore.createProposal(
            [Constants.ZERO_ADDRESS], 
            [0], 
            [Constants.ZERO_ADDRESS], 
            combined_text, 
            account, 
            chainId);
  
          setProposalId(pId);
        }


      }


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
          height: 590,
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
        <div>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox onChange={() => setIsFirstChecked(!isFirstChecked)}/>}
                label="Create proposal with action"/>
        </FormGroup>

    </div>

        <div>
            <TextField
              id="outlined-textarea"
              label="Title"
              multiline
              rows={1}
              value={description_title}
              onChange={handleDescriptionTitleChange}
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
        {isFirstChecked ?         
        <>
            <TextField
              id="outlined-multiline-flexible"
              label="Target addresses array"
              multiline
              value={targets}
              maxRows={1}
              onChange={handleTargetsChange}
            />

            <TextField
              id="outlined-textarea2"
              label="Values array"
              multiline
              value={values}
              maxRows={1}
              onChange={handleValuesChange}
            />

            <TextField
              id="outlined-multiline-static"
              label="Calldatas array"
              multiline
              value={calldata}
              maxRows={1}
              onChange={handleCalldataChange}
            />
            </>: ''}

        </div>

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
