import { ipServer } from "../ipConfig.js"; // Caminho para o arquivo com as configurações do IP
const btnEntrar = document.querySelector('#btnEntrar');

console.log("O IP do servidor é:", ipServer);

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

function getUserTask(username, passwrd) {
    fetch(`http://${ipServer}:3000/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then(dados => {
            if (!dados) {   
                alert('Usuário não existe!');
            } else {
                const senha = dados.passwrd;

                if (senha === passwrd) {
                    console.log("Senha correta");
                    id = dados._id;  // No MongoDB, o campo é _id
                    nivel = dados.nivel;

                    localStorage.setItem('idUser', id);
                    localStorage.setItem('nivel', nivel);

                    if (nivel === 1) {
                        window.location.href = `http://${ipServer}:13542/Front/pages/taskManager.html`;
                    } else if (nivel === 2) {
                        window.location.href = `http://${ipServer}:13542/Front/pages/taskColab.html`;
                    }
                } else {
                    alert('Senha INCORRETA');
                }
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao tentar fazer login');
        });
}

// Permitir login com a tecla "Enter"
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        callLogin();
    }
});
