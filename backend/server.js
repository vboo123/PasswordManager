const express = require('express')
const app = express()
const port = process.env.PORT || 3001;
const mysql = require('mysql')
const cors = require('cors')
var pbkdf2 = require('pbkdf2-sha256')
const session = require('express-session');
const init = require('./initialization.js')
const ac = require('./customer.js')
const { query } = require('express')

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
    var query = mysql.format("SELECT customerID, username, masterPassword FROM Customers WHERE username = ?", [username]);
    console.log(username)
    db.query(query, (error, data) => {
        console.log("hello")

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
                req.session.save()
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

//logout
app.post("/logout", (req, res) => {
    //properly end session for user and prevent anything to happen until logged in again
    req.session.destroy();    
    res.send({
        log: "Logout Successful"
    })
    
})

app.post("/newVault", (req, res) => {
    customerID = req.body.id
    vaultName = req.body.name
    
    vaultID = req.body
    vaultID = customerID + vaultName
    //check if vaultName already exists for specific customer id
    var query = mysql.format("SELECT vaultName FROM CustomerVaults WHERE EXISTS(SELECT * FROM CustomerVaults WHERE customerID = ? AND vaultName = ?)", [customerID, vaultName]);
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
    vaultID = customerID + vaultName
    //check if description already exists in VaultMaster for that specific vaultID
    var query = mysql.format("SELECT description FROM VaultMaster WHERE EXISTS(SELECT * FROM VaultMaster WHERE vaultID = ? AND description = ?)", [vaultID, description]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log(data)
        if(data[0] != null){
            res.send({
                log: "Description already present. Please select new Description"
            })
        }
        else{
            query = mysql.format("INSERT INTO VaultMaster(vaultID, description, password) VALUES (?, ?, ?)", [vaultID, description, password]);
            db.query(query, (error, data) => {
                if(error){
                    res.send({
                        log: "Values could not be inserted"
                    })
                    throw error
                }
                res.send({
                    log: "success"
                })
            })
        }
    })
})


//get all the vaults for a specific customer
app.post("/vaults", (req, res) => {
    customerID = req.body.id
    console.log(customerID)
    var query = mysql.format("SELECT vaultName, vaultID FROM CustomerVaults WHERE customerID = ?", [customerID]);
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

//delete vault
app.post("/deleteVault", (req, res) => {
    customerID = req.body.id
    vaultName = req.body.name
    vaultID = customerID + vaultName
    console.log(vaultID)
    var query = mysql.format("DELETE FROM CustomerVaults WHERE vaultID = ?", [vaultID]);
    db.query(query, (error, data) => {
        if(error){
            res.send({
                log: "Issue deleting vault"
            })
            throw error
        }
        //delete all content in VaultMaster for that specific vaultID
        var query = mysql.format("DELETE FROM VaultMaster WHERE vaultID = ?", [vaultID]);
        db.query(query, (error, data) => {
            if(error){
                throw error
            }
            res.send({
                log: "Vault deleted succesfully"
            })
        })
    })
})

//delete vault content
app.post("/deleteVaultContent", (req, res) => {
    customerID = req.body.id
    vaultName = req.body.vaultName
    description = req.body.description
    console.log(description)
    vaultID = customerID + vaultName
    console.log(vaultID)
    var query = mysql.format("DELETE FROM VaultMaster WHERE vaultID = ? AND description = ?", [vaultID, description]);
    db.query(query, (error, data) => {
        if(error){
            res.send({
                log: "Issue deleting vault content"
                })
                throw error
            }
        res.send({
            log: "Vault content deleted succesfully"
        })
    })
})
                    

//get all the vaults for a specific customer
app.post("/vaultContents", (req, res) => {
    vaultName = req.body.name
    vaultID = req.body.id + vaultName
    console.log(vaultID)
    var query = mysql.format("SELECT description, password FROM VaultMaster WHERE vaultID = ?", [vaultID]);
    db.query(query, (error, data) => {
        if(error){
            throw error
        }
        data = JSON.parse(JSON.stringify(data))
        console.log(data)
        res.json(data)
    })
})

app.listen(port, () => console.log('Server is Running on port' + port))

