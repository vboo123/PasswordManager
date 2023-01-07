const uuid = require('uuid');
const mysql = require('mysql')
var pbkdf2 = require('pbkdf2-sha256')

function createCustomerID(){
    customerID = uuid.v4()
    return customerID
}

function createVaultKey(username, password){
    vaultKey = hash(username + password)
}

function createAuthenticationKey(vaultKey, password){
    authKey = hash(vaultKey + password)
    return authKey
}

function hash(value) {
    var key = value
    var salt = 'salt'
    var res = pbkdf2(key, salt, 1, 64);
    return res.toString('hex')
}
//function called from Post Req for registration. Takes in username and res object
async function addCustomer(db, username, password, res){
    vaultKey = createVaultKey(username, password)
    authKey = createAuthenticationKey(vaultKey, password)
    query = mysql.format("SELECT username FROM Customers WHERE EXISTS(SELECT * FROM Customers WHERE username = ?)", [username]);
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
        data = JSON.parse(JSON.stringify(data))
        //if database already has username, dont allow registration, otherwise, add user
        if(data[0] != null){
            res.send({
                log: "Username already exists"
            })
        }
        else{
            //generate new customerID and send logs to frontend
            id = createCustomerID()
            query = mysql.format("INSERT INTO Customers(customerID, username, masterPassword) VALUES (?, ?, ?)", [id, username, authKey]);
            db.query(query, (error, data) => {
                if(error){
                    throw error
                }
               res.send({
                    log: "Values Inserted Succesfully"
               }) 
            })
        }
    })
}

exports.addCustomer = addCustomer;
exports.hash = hash;
exports.createVaultKey = createVaultKey;
exports.createAuthenticationKey = createAuthenticationKey;