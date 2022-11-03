

async function getUsername(){
    let allUsernames = await fetch('/checkUsername');
    let usernamesjson = await allUsernames.json();
    
    const usernameAvail = document.querySelector("#status");
    const inputUsername = document.querySelector("#txtUsername");

    
    for (let index=0; index < usernamesjson.length; index++){
        if (inputUsername.value === usernamesjson[index]){
            console.log(inputUsername.value);
            usernameAvail.innerhtml= "Username Taken!";
            break 
        }else{
            usernameAvail.innerhtml = "Username Available"
        }
}
}

