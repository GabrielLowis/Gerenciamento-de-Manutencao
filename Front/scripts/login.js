const btnEntrar = document.querySelector('#btnEntrar');

let id = 0;
let nivel = 0;
export let inputEmail = 0;

function callLogin() {
    inputEmail = document.querySelector('#inputEmail').value;
    const inputSenha = document.querySelector('#inputSenha').value;

    getUserTask(inputEmail, inputSenha);
}


if (btnEntrar) {
    btnEntrar.addEventListener('click', () => {
        callLogin();
    });
}


function getUserTask(username, passwrd){

    fetch(`http://10.116.81.5:3000/users/${username}`)
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.log('nok');
        }
    })
    .then(dados => {
        if (dados.length === 0) {   
            alert('Não existe esse usuario')
        } else {
            const senha = dados[0].passwrd;

            if (senha === passwrd) {
                console.log("Senha correta");
                id = dados[0].id;
                nivel = dados[0].nivel

                localStorage.setItem('idUser', id);
                localStorage.setItem('nivel', nivel)

                if (dados[0].nivel === 1) {
                    window.location.href = 'http://10.116.81.5:13542/Front/pages/taskManager.html';
                } else if (dados[0].nivel === 2) {
                    window.location.href = 'http://10.116.81.5:13542/Front/pages/taskColab.html';
                }
                
                

            } else {
                alert('Senha INCORRETA')
            }

           
        }
    })   
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Verifica se a tecla é o Enter
        callLogin();
    }
});