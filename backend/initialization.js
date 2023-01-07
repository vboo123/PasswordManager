async function createCustomerTable(db) {
    query = "use PasswordManager";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
    })
    query = "CREATE TABLE IF NOT EXISTS Customers(customerID VARCHAR(255), username VARCHAR(255), masterPassword VARCHAR(255))";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log("Table Created Succesfully")
    })
}

//create a customer vaults table
async function createCustomerVaultsTable(db){
    query = "use PasswordManager";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
    })
    query = "CREATE TABLE IF NOT EXISTS CustomerVaults(customerID VARCHAR(255), vaultID VARCHAR(255), vaultName VARCHAR(255))";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log("Table Created Succesfully")
    })
}

//create a customer vaults table
async function createVaultMaster(db){
    query = "use PasswordManager";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
    })
    query = "CREATE TABLE IF NOT EXISTS VaultMaster(vaultID VARCHAR(255), description VARCHAR(255), password VARCHAR(255))";
    await db.query(query, (error, data) => {
        if(error){
            throw error
        }
        console.log("Table Created Succesfully")
    })
}


function initialize(db){
    createCustomerTable(db);
    createCustomerVaultsTable(db);
    createVaultMaster(db);
}

exports.initialize = initialize;