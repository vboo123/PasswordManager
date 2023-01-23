import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './home.jsx'
import Register from './registration.jsx'
import { useNavigate } from "react-router-dom";
var customerId = 0;

function loginCustomer(a,b){
  console.log("username:" + a)
  console.log(
    "password:" + b
  )
  fetch("http://localhost:3001/login", {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
          uname: a,
          pword: b
  })
  })
  .then(res => {       
      return res.json()
  })
  .then(data => {
      customerId = data.id;
      alert(data.log) 
      CallHome(customerId)
      
  })
  .catch(err => console.log(err))
}

function CallHome(customerId){
  console.log(customerId)
  if(customerId != 0){
    //https://ui.dev/react-router-url-parameters
    const element = "/home/" + customerId
    window.location.href = element;
  }
}

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {    
              //if username is empty, alert user
              if(username == ''){
                alert("Please enter a username")
              }
              //if password is empty, alert user
              else if(password == ''){
                alert("Please enter a password")
              }
              else{
                //if username and password are not empty, call loginCustomer function
                loginCustomer(username, password)
              }
            }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link to="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>

        </Box>
    </Container>
    </div>

  );
}