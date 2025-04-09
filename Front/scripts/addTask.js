import { ipServer } from "../ipConfig.js"; // Caminho para o arquivo com as configurações do ip
let idUser = localStorage.getItem('idUser');

// ----------------------------
const img = document.getElementById("imgUpload");
const fileInput = document.getElementById("fileInput");
const addTaskAdicionar = document.getElementById("addTaskAdicionar");

let selectedFile = null;
let imageId = null;

// Clique na imagem para abrir o input de arquivo
img.addEventListener("click", () => fileInput.click());

// Atualiza a imagem localmente
fileInput.addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
});

// Clique no botão "Adicionar"
addTaskAdicionar.addEventListener("click", async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    // Caso vindo da tela de infoChamado
    if (urlParams.get('source') === 'infoChamado') {
        const idImg = localStorage.getItem('idImage');
        imageId = idImg;
        console.log('idImagem:' + imageId);
        createTask(idUser);
    } else {
        if (!selectedFile) {
            alert("Por favor, selecione uma imagem.");
            return;
        }

        // Enviar imagem
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch(`http://${ipServer}:3000/upload-image`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                imageId = result.imageId;
                console.log("imagem: " + imageId);
                createTask(idUser);
            } else {
                alert("Erro ao enviar imagem.");
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);
            alert("Erro ao enviar a imagem.");
        }
    }
});


// ----------------------------
function createTask(idUser) {
    console.log("idUser:", idUser);

    let inputTitle = document.getElementById("inputNameTask").value;

    let statusSpan = document.getElementById("statusSpan").textContent.trim();
    statusSpan = statusSpan.charAt(0).toLowerCase() + statusSpan.slice(1);

    let prioSpan = document.getElementById("prioSpan").textContent.trim();
    prioSpan = prioSpan.charAt(0).toLowerCase() + prioSpan.slice(1);

    let inputRespon = document.getElementById("inputRespon").value.trim();
    inputRespon = inputRespon.charAt(0).toLowerCase() + inputRespon.slice(1);

    let inputSala = document.getElementById("inputSala").value.trim();
    let inputData = document.getElementById("inputData").value;
    let descricao = document.getElementById("descricao").value.trim();

    // Converter para Date padrão MongoDB
    const dataFormatada = new Date(inputData);

    const taskData = {
        id_user: idUser,
        task_title: inputTitle,
        task_status: statusSpan,
        task_prior: prioSpan,
        task_prazo: dataFormatada,
        task_sala: inputSala,
        task_respon: inputRespon,
        task_text: descricao,
        id_image: imageId,
      };
      

    fetch(`http://${ipServer}:3000/user/${idUser}/tasks/createTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    })
        .then(async (response) => {
            if (response.status === 200) {
                alert('Tarefa criada com sucesso');
                const urlParams = new URLSearchParams(window.location.search);

                if (urlParams.get('source') === 'taskManager') {
                    window.location.href = `http://${ipServer}:13542/Front/pages/taskManager.html`;
                }

                if (urlParams.get('source') === 'taskColab') {
                    window.location.href = `http://${ipServer}:13542/Front/pages/taskColab.html`;
                }

                return await response.json();
            } else {
                alert('Erro ao criar a tarefa');
                throw new Error('Erro ao criar a tarefa');
            }
        })
        .then((dados) => {
            console.log('Nova tarefa criada:', dados);
        })
        .catch((err) => {
            console.error("Erro na criação da tarefa:", err);
        });
}


function deleteCall() {
    const idCall = localStorage.getItem('idCall');

    fetch(`http://${ipServer}:3000/call/deleteCall/${idCall}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Tarefa deletada com sucesso!");
                // Aqui você pode recarregar a lista de tarefas
                console.log(`Tarefa ${idCall} deletada!`);
            } else if (response.status === 404) {
                alert("Tarefa não encontrada.");
            } else {
                alert("Erro ao deletar a tarefa.");
            }
            return response.json();
        })
        .catch((err) => {
            console.error("Erro na exclusão da tarefa:", err);
        });
}


document.getElementById('addTaskAdicionar').addEventListener('click', () => {

    // Obtendo os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);

    // Verifica se o parâmetro 'source' tem o valor 'openCalls'
    if (urlParams.get('source') === 'infoChamado') {
        // createTask(idUser);
        deleteCall()

        window.location.href = `http://${ipServer}:13542/Front/pages/openCalls.html`;
    }

});

