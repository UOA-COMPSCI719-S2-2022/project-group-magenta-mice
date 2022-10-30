function checkSamePasswords(){
                
    if(document.newForm.password !== document.newForm.confirmedPassword){
        return false;
    }else{
        return true;
    }
    

}
module.export= checkSamePasswords;