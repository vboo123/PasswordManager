import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Container } from "@mui/system";
import { Fullscreen } from "@mui/icons-material";
var customerId = 0;

function createVault(vaultName) {
  fetch("http://localhost:3001/newVault", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: customerId,
      name: vaultName,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.log);
    })
    .catch((err) => console.log(err));
}

export default function Home(props) {
  const { id } = useParams();
  customerId = id;
  //hook to store the content of vaults from fetch api
  const [vaults, setVaults] = useState([]);
  // Since the useEffect Hook always gets called on the first render, we need to put our fetchProducts function inside useEffect so that it gets called when the page loads. Otherwise, our function will not get called and our data will not be fetched. So now when our page loads, our data will be fetched.
  // To prevent the useEffect Hook from being executed in an endless loop (due to the fact that it runs after every render and every update by default), we pass an empty array as a second argument to useEffect. By doing this, our useEffect Hook will run only after the first render — even if the component’s state is updated:
  useEffect(() => {
    getVaults();
  }, []);

  const getVaults = () => {
    fetch("http://localhost:3001/vaults", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: customerId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVaults(data);
      });
  };

  const deleteVault = (vaultName) => {
    fetch("http://localhost:3001/deleteVault", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: customerId,
        name: vaultName,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(data.log);
      });
  }
  
  return (
    <div>
    <Box
      sx={{ width: 300} }
      >
      <List>
        {vaults.map((vault) => (
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              onClick={() => {
                //call vault compi
                const element = "/home/vault/" + id + "/" + vault.vaultName
                console.log(element)
                window.location.href = element;
              }}
            >
              <ListItemText primary={vault.vaultName} />
            </ListItemButton>
            <container />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          {/* add vault button */}
          <ListItemButton
            onClick={() => {
              let vaultName = prompt("Enter a Vault Name");
              if(vaultName != ""){
                createVault(vaultName);
              }
              else{
                alert("Please enter a valid vault name");
              }
            }}
          >
            <ListItemText primary="Add Vault" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          {/* delete vault button */}
          <ListItemButton 
          onClick={() => {
            let vaultName = prompt("Enter a Vault Name");
            let tmp = 0
            //loop through vaults and check if vaultName is in there
            for(let i = 0; i < vaults.length; i++){
              if(vaults[i].vaultName == vaultName){
                tmp = 1
              }
            }
            if(vaultName == "" || tmp == 0){
              alert("Please enter a valid vault name");
            }
            else{
              deleteVault(vaultName);
            }
          }
          }
          >
            <ListItemText primary="Delete Vault" />
          </ListItemButton>
        </ListItem>
      </List>
      </Box>
    </div>
  
  );
    
}
