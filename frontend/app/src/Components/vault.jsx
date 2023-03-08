import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
var customerId = 0

export default function Vault() {
    const {id, vaultName} = useParams();
    console.log(id)
    console.log(vaultName)
    customerId = id
    console.log("YOOO")
    const [vaultData, setVaultData] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const getVaultContent = (vaultName) => {
        fetch("http://localhost:3001/vaultContents", {
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
            setVaultData(data)
            console.log(data)
            
          });
      };
    
    const addVaultData = (vaultName, description, password) =>{
        fetch("http://localhost:3001/addData", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                vaultName: vaultName,
                description: description,
                password:password,
                id: customerId
        })
        })
        .then(res => {        
            return res.json()
        })
        .then(data => {
            console.log(data)
            alert(data.log)
        })
        .catch(err => console.log(err))
    }
    useEffect(() => {
        getVaultContent(vaultName)
    }, [])
    //if i dont put it in useEffect, console.log goes absolutely crazy
    // getVaultContent(vaultName)

return (
    <div>
        <h1>{vaultName}</h1>
        {vaultData.map(home => <div>Username: {home.description} Password: {home.password}</div>)}
        <input type="text" placeholder="Username" onChange={(e) => {
            setUsername(e.target.value)
        }}/>
        <input type="text" placeholder="Password" onChange={(e) => {
            setPassword(e.target.value)
        }}/>
        <button onClick={() => {
            if(username == ""){
                alert("Please enter a valid description")
            }
            else if(password == ""){
                alert("Please enter a valid password")
            }
            else{
              addVaultData(vaultName, username, password)
            }

        }
        }>Add Vault Content</button>

    </div>
);
}
