let registrationName = document.getElementById('name');
let registrationLastName = document.getElementById('lastName');
let registrationEmail = document.getElementById('email');
let registrationPassword = document.getElementById('password');

let registerButton = document.getElementById('register');

let registerUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
}


registerButton.addEventListener("click", function (evento) {

    evento.preventDefault();
    
    registrationName = nomalizaTextoRetiraEspacos(registrationName.value);
    registrationLastName = nomalizaTextoRetiraEspacos(registrationLastName.value);
    registrationEmail = nomalizaTextoRetiraEspacos(registrationEmail.value);
    registrationPassword = nomalizaTextoRetiraEspacos(registrationPassword.value);

    registerUser.firstName = registrationName;
    registerUser.lastName = registrationLastName;
    registerUser.email = registrationEmail;
    registerUser.password = registrationPassword;
    

    // API - registrar usuário

    let registerUserEmJson = JSON.stringify(registerUser);
    console.log(registerUserEmJson);

    let configRequest = {
        method: "POST",
        headers: {
            "Content-type": "Application/json"
        },
        body: registerUserEmJson
    }
    fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users/", configRequest)
        .then(
            resultado => {
                if (resultado.status == 201 || resultado.status == 200) {
                    return resultado.json();
                } else {
                    throw resultado;
                }
            }
        ).then(
            resultado => {
                registrationSucess(resultado);
            }
        ).catch(
            erro => {

                if (erro.status == 400 || erro.status == 500) {
                    alert("Usuário já cadastrado/Algum dado está incompleto");
                }
                console.log(erro);
            }

        )
});


/*async function registraUsuario() {

     //Comunicando com API
     
     let registerUserEmJson = JSON.stringify(registerUser);
     console.log(registerUserEmJson);

     let configRequest = {
        method: "POST",
        headers: {
            "Content-type": "Application/json"
        },
        body: registerUserEmJson
    }

    try {

        let resposta = await fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users/", configRequest)
            
        
         if (resposta.status == 200) {
            let respostaConvertida = await resposta.json();
            registrationSucess(respostaConvertida)
         }else {
            throw resposta
         }
    } catch (erro) {
        if (erro.status == 400 || erro.status == 500) {
            alert("Usuário já cadastrado/Algum dado está incompleto");
        }
    }

}*/

function registrationSucess(resultSucess) {

    console.log(resultSucess);

    sessionStorage.setItem("jwt", resultSucess.jwt);

    location.href = "tarefas.html";

}

function registrationErro(resultErro) {

    console.log(resultErro);
}

registrationEmail.addEventListener("keyup", () => {

    let emailValidation = document.getElementById("emailValidation");

    if (registrationEmail.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        emailValidation.innerText = ""
        registrationEmail.style.border = "2px solid transparent"

    } else {

        emailValidation.innerText = "Campo obrigatório"
        emailValidation.style.color = "#E9554EBB"
        registrationEmail.style.border = "2px solid #E9554EBB"

    }

    validRegistration(registrationEmail.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), registrationPassword.value);

});

registrationPassword.addEventListener("keyup", () => {
    let passwordValidation = document.getElementById("passwordValidation");


    if (registrationPassword.value) {

        passwordValidation.innerText = ""
        registrationPassword.style.border = "2px solid transparent"

    } else {

        passwordValidation.innerText = "Campo obrigatorio"
        passwordValidation.style.color = "#E9554EBB"
        registrationPassword.style.border = "2px solid #E9554EBB"

    }
    validRegistration(registrationEmail.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), registrationPassword.value);

});

function validRegistration(emailReg, passwordReg) {
    if (emailReg && passwordReg) {
        //True
        registerButton.removeAttribute("disabled");
        registerButton.style.backgroundColor = "#7898ff";
        registerButton.innerText = "Cadastrar";

        return true;

    } else {
        //False
        registerButton.removeAttribute("disabled", true);
        registerButton.style.backgroundColor = "#979797";
        registerButton.innerText = "Bloqueado";

        return false;

    }
}