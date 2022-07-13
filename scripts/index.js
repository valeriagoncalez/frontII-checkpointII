let emailLogin = document.querySelector("#inputEmail");
let passwordLogin = document.querySelector("#inputPassword");

let botaoLogin = document.querySelector("#botaoLogin");

/* Altera as caracteristicas do botão login */
botaoLogin.style.backgroundColor = "#979292A1"
botaoLogin.innerText = "Bloqueado";

let objetoUsuario = {
    email: "",
    password: ""
}

let loginUsuarioJson = "";

botaoLogin.addEventListener("click", function (evento) {


    if (validaLogin(emailLogin.value, passwordLogin.value)) {

        evento.preventDefault();

        /* Normalização*/
        emailLogin = nomalizaTextoRetiraEspacos(emailLogin.value);
        passwordLogin = nomalizaTextoRetiraEspacos(passwordLogin.value);

        objetoUsuario.email = emailLogin;
        objetoUsuario.password = passwordLogin;

        let objetoUsuarioEmJson = JSON.stringify(objetoUsuario);

        console.log(objetoUsuarioEmJson);

        //Comunicando com API

        let configRequest = {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: objetoUsuarioEmJson
        }

        fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users/login", configRequest)
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
                    loginSucesso(resultado);
                }

            ).catch(
                erro => {

                    if (erro.status == 400 || erro.status == 404) {
                        loginErro("Email e/ou senha inválidos");
                    }

                }

            );

    } else {
        console.log("Login inválido");
    }

});

async function loginApi() {
    let configRequest = {
        method: "POST",
        headers: {
            "Content-type": "Application/json"
        },
        body: objetoUsuarioEmJson
    }

    try {
        let resposta = await fetch("https://ctd-fe2-todo-v2.herokuapp.com/v1/users/login", configRequest);

        if (resposta.status == 201) {
            let respostaFinal = await resposta.json();

            loginSucesso(respostaFinal);
        } else {
            throw resposta;
        }

    } catch (erro) {

        if (erro.status == 400 || erro.status == 404) {
            loginErro("Email e/ou senha inválidos")
        }
    }
}

function loginSucesso(resultadoSucesso) {
    console.log(resultadoSucesso);

    //salvando o token
    sessionStorage.setItem("jwt", resultadoSucesso.jwt);

    location.href = "tarefas.html";

}

function loginErro(resultadoErro) {

    console.log(resultadoErro);
    alert(resultadoErro);
}

function validaLogin(email, password) {
    if (email && password) {
        //True
        botaoLogin.style.backgroundColor = "#7898FF"
        botaoLogin.innerText = "Acessar";
        botaoLogin.removeAttribute("disabled");

        return true;

    } else {
        //False
        botaoLogin.style.backgroundColor = "#979292A1";
        botaoLogin.innerText = "Bloqueado"
        botaoLogin.setAttribute("disabled", true)

        return false;

    }
}

emailLogin.addEventListener("keyup", () => {

    emailLogin = document.querySelector("#inputEmail");
    passwordLogin = document.querySelector("#inputPassword");

    let emailValidacao = document.getElementById("validacaoEmail");
    console.log(emailValidacao);

    if (!emailLogin.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
        emailValidacao.innerText = "Preenchimento obrigatório"
        emailValidacao.style.color = "#E9554EBB"
        emailLogin.style.border = "2px solid #E9554EBB"

    } else {

        emailValidacao.innerText = ""
        emailValidacao.style.color = "#E9554EBB"
        emailLogin.style.border = "2px solid transparent"

    }

    validaLogin(emailLogin.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), emailLogin.value);

});

passwordLogin.addEventListener("keyup", () => {
    emailLogin = document.querySelector("#inputEmail");
    passwordLogin = document.querySelector("#inputPassword");

    let validacaoSenha = document.getElementById("validacaoSenha");
    console.log(validacaoSenha);


    if (!passwordLogin.value) {

        validacaoSenha.innerText = "Campo obrigatório"
        validacaoSenha.style.color = "#E9554EBB"
        passwordLogin.style.border = "2px solid #E9554EBB"

    } else {

        validacaoSenha.innerText = ""
        passwordLogin.style.color = "2px solid transparent"

    }
    validaLogin(emailLogin.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), passwordLogin.value);

});