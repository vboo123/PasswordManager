var customerId = 0;

const box = document.createElement("div");
                box.id = "button-box";
                document.body.appendChild(box);

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
        if(data.log != "Vault Name already present. Please select new vaultName"){
            getSpecificVault(vaultName)
        }
    })
    .catch(err => console.log(err))

}

function addVaultData(vaultName, description, password){
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
    })
    .catch(err => console.log(err))
}


function getSpecificVault(name){
    vaultId = customerId + name
    const button = document.createElement('button');
                button.innerText = name;
                button.id = vaultId;
                box.appendChild(button);
}


function getVaults(){
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
    })
    .then(data => {
        console.log(data)
        console.log("data length" + data.length)
        if(data.length == 0){
            alert("No vaults for this user")
        }
        else{
            for(var i = 0; i < data.length; i++){
                //write to html

                const button = document.createElement('button');
                button.innerText = data[i].vaultName;
                button.id = data[i].vaultID;
                box.appendChild(button);
            }
        }
    })
    .catch(err => console.log(err))
}


function getVaultContent(vaultID){
    fetch("http://localhost:3001/vaultContents", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: vaultID,
    })
    })
    .then(res => {        
        return res.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err))
}


//The addEventListener() method attaches an event handler to a document.
//used for doing the respective action when a specific button is clicked
document.addEventListener('click', function(e){
    if(e.target && e.target.nodeName == "BUTTON"){
        console.log(e.target.id)
        getVaultContent(e.target.id)
    }
})

