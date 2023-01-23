const express = require('express')
const app = express()
const PORT = 3001
const mysql = require('mysql')
const cors = require('cors')
var pbkdf2 = require('pbkdf2-sha256')
const session = require('express-session');
const init = require('./initialization.js')
const ac = require('./customer.js')

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 60 * 1000
    // }
}));

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
})

db.connect(err => {
    if(err){
        throw err
    }
    console.log("MYSQL Connected")
    var query = "CREATE DATABASE IF NOT EXISTS PasswordManager";
    db.query(query, (error, data) => {
        if(error){
            throw error;
        }
        console.log("PasswordManager Database Created")
    })
})

init.initialize(db)

app.post("/registration", (req, res) => {
    username = req.body.uname
    masterPassword = req.body.pword
    ac.addCustomer(db, username, masterPassword, res)

})

app.post("/login", (req, res) => {
    username = req.body.uname
    password = req.body.pword

    vaultKey = ac.createVaultKey(username, password)
    authKey = ac.createAuthenticationKey(vaultKey, password)
    query = mysql.format("SELECT customerID, username, masterPassword FROM Customers WHERE username = ?", [username]);
    console.log("hi1")
    db.query(query, (error, data) => {
        if(error){
            console.log("hi2")
            res.send({
                log: "Login Failed"
            })
            throw error
        }
        console.log(data)
        if(data != null){
            data = JSON.parse(JSON.stringify(data))
            if(data[0].masterPassword == authKey){
                req.session.customerID = data[0].customerID;
                res.send({
                    id: req.session.customerID,
                    log: "Login Successful"
                })
            }
            else{
                res.send({
                    log: "Login Failed"
                })
            } 
        }
        else{
            res.send({
                log: "Login Failed"
            })
        }
    })

})

app.post("/newVault", (req, res) => {
    customerID = req.body.id
    vaultName = req.body.name
    
    vaultID = req.body
    vaultID = customerID + vaultName
    query = mysql.format("SELECT vaultName FROM CustomerVaults WHERE EXISTS(SELECT * FROM CustomerVaults WHERE vaultName = ?)", [vaultName]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log(data)
        if(data[0] != null){
            res.send({
                log: "Vault Name already present. Please select new vaultName"
            })
        }
        else{
            query = mysql.format("INSERT INTO CustomerVaults(customerID, vaultID, vaultName) VALUES (?, ?, ?)", [customerID, vaultID, vaultName]);
            db.query(query, (error, data) => {
                if(error){
                    res.send({
                        log: "Issue creating vault"
                    })
                    throw error
                }
                res.send({
                    log: "Vault created succesfully"
                })
            })
        }
    })
    
    
})

//add data to vault
app.post("/addData", (req, res) => {
    description = req.body.description
    password = req.body.password
    vaultName = req.body.vaultName
    customerID = req.body.id
    console.log(customerID)
    console.log(vaultName)
    vaultID = customerID + vaultName
    console.log(vaultID)
    query = mysql.format("INSERT INTO VaultMaster(vaultID, description, password) VALUES (?, ?, ?)", [vaultID, description, password]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log("Values Inserted into VaultMaster Succesfully")
    }
    )
})

//get all the vaults for a specific customer
app.post("/vaults", (req, res) => {
    customerID = req.body.id
    console.log(customerID)
    query = mysql.format("SELECT vaultName, vaultID FROM CustomerVaults WHERE customerID = ?", [customerID]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        data = JSON.parse(JSON.stringify(data))
        console.log(data)
        res.json(data)
    }
    )
})

//get all the vaults for a specific customer
app.post("/vaultContents", (req, res) => {
    vaultID = req.body.id
    console.log(vaultID)
    query = mysql.format("SELECT description, password FROM VaultMaster WHERE vaultID = ?", [vaultID]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        data = JSON.parse(JSON.stringify(data))
        console.log(data)
        res.json(data)
    })
})

app.listen(PORT)

