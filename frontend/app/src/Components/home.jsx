import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
var customerId = 0;

export default function Home(){
  const {id} = useParams()
  customerId = id
  //hook to store the content of vaults from fetch api
  const [vaults, setVaults] = useState([]);
  // Since the useEffect Hook always gets called on the first render, we need to put our fetchProducts function inside useEffect so that it gets called when the page loads. Otherwise, our function will not get called and our data will not be fetched. So now when our page loads, our data will be fetched.
  // To prevent the useEffect Hook from being executed in an endless loop (due to the fact that it runs after every render and every update by default), we pass an empty array as a second argument to useEffect. By doing this, our useEffect Hook will run only after the first render — even if the component’s state is updated:
  useEffect(() => {
    getVaults();
  }, []);

  const getVaults = () => {
    fetch("http://localhost:3001/vaults", {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
          id: customerId,
      })
    })
    .then(res => {
      return res.json()
    }
    )
    .then(data => {
      setVaults(data)
    }
    )
  }
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          {vaults.map((vault) => (
            <ListItem disablePadding>
              <ListItemButton component="a" href={"/vault/" + vault.id}>
                <ListItemText primary={vault.vaultName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
                //eventually modify this to look nice and make use of useState
                let vaultName = prompt("Enter a Vault Name")
                createVault(vaultName)
            }}>
              <ListItemText primary="Add Vault" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Delete Vault" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}

function createVault(vaultName){
   fetch("http://localhost:3001/newVault", {
       method: 'POST',
       headers: {
           'Content-type': 'application/json'
       },
       body: JSON.stringify({
           id: customerId,
           name: vaultName
   })
   })
   .then(res => {        
       return res.json()
   })
   .then(data => {
       //the reason getVaults() works here and in login is because we are waiting for data to come back and doing something with the value. AKA we are correctly handling the promise
       //so, thats why we are making it async. Otherwise, it doesnt call getVaults(). 
       alert(data.log)
      //  if(data.log != "Vault Name already present. Please select new vaultName"){
      //      getSpecificVault(vaultName)
      //  }
   })
   .catch(err => console.log(err))

}
