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
    selectedFile = event.target.files[0]; // Armazena o arquivo selecionado
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result; // Atualiza a imagem localmente
        };
        reader.readAsDataURL(selectedFile);
    }
});

// Clique no link "Adicionar"
addTaskAdicionar.addEventListener("click", async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do link

    const urlParams = new URLSearchParams(window.location.search);

    // Verifica se o parâmetro 'source' tem o valor 'openCalls'
    if (urlParams.get('source') === 'infoChamado') {
        const idImg = localStorage.getItem('idImage');
        imageId = idImg
        console.log('idImagem:' + imageId);
        createTask(idUser);
    } else {
        if (!selectedFile) {
            alert("Por favor, selecione uma imagem.");
            return;
        }
    
        // Cria o FormData com a imagem
        const formData = new FormData();
        formData.append("image", selectedFile); // Envia apenas a imagem
    
        try {
            const response = await fetch("http://10.116.81.5:3000/upload-image", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.json();
                imageId = result.imageId; // Armazena o ID na variável global
                // alert("Imagem enviada com sucesso! ID: " + imageId);
                console.log("imagem: " + imageId);
    
                createTask(idUser);
    
            } else {
                alert("Erro ao enviar imagem.");
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);
            alert("Err  o ao enviar a imagem.");
        }
    }
});




// ----------------------------
function createTask(idUser) {
    console.log(idUser);


    let inputTitle = document.getElementById("inputNameTask").value;

    let statusSpan = document.getElementById("statusSpan");
    statusSpan = statusSpan.textContent.charAt(0).toLowerCase() + statusSpan.textContent.slice(1);

    let prioSpan = document.getElementById("prioSpan");
    prioSpan = prioSpan.textContent.charAt(0).toLowerCase() + prioSpan.textContent.slice(1);

    let inputRespon = document.getElementById("inputRespon").value;
    inputRespon = inputRespon.charAt(0).toLowerCase() + inputRespon.slice(1);

    let inputSala = document.getElementById("inputSala").value;

    let inputData = document.getElementById("inputData").value;
    function converterParaDataBrasileira(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    inputData = converterParaDataBrasileira(inputData);

    let descricao = document.getElementById("descricao").value;

    // Fazer a requisição para criar uma nova tarefa
    fetch(`http://10.116.81.5:3000/user/${idUser}/tasks/createTask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUser, inputTitle, statusSpan, prioSpan, inputData, inputSala, inputRespon, descricao, imageId })
    })
        .then(response => {
            if (response.status === 200) {
                console.log('teste imagem: ' + imageId);
                alert('Tarefa criada com sucesso');

                const urlParams = new URLSearchParams(window.location.search);

                // Verifica se o parâmetro 'source' tem o valor 'taskManager'
                if (urlParams.get('source') === 'taskManager') {
                    window.location.href = 'http://10.116.81.5:13542/Front/pages/taskManager.html';
                }

                if (urlParams.get('source') === 'taskColab') {
                    window.location.href = 'http://10.116.81.5:13542/Front/pages/taskColab.html';
                }

                return response.json();
            } else {
                alert('Erro ao criar a tarefa');
                throw new Error('Erro ao criar a tarefa');
            }
        })
        .then(dados => {
            console.log('Nova tarefa criada:', dados);
        });
}

function deleteCall() {
    const idCall = localStorage.getItem('idCall');

    fetch(`http://10.116.81.5:3000/call/deleteCall/${idCall}`, {
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
            
        window.location.href = 'http://10.116.81.5:13542/Front/pages/openCalls.html';
    }

});

