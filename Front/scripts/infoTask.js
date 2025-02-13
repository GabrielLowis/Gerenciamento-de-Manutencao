let idUser = localStorage.getItem('idUser');
let idTask;



const img = document.getElementById("imgUpload");
const fileInput = document.getElementById("fileInput");
const addTaskAdicionar = document.getElementById("addTaskAdicionar");
let selectedFile = null;
let idImage = null;



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



window.onload = function () {
    idTask = localStorage.getItem('taskId');
    console.log(idTask);

    getTask(idUser, idTask);
}


// ----------------------------
export function getTask(idUser, idTask) {
    fetch(`http://10.116.75.167:3000/user/${idUser}/tasks/${idTask}`)
        .then(response => {
            if (response.status === 200) {
                console.log('funcionou');
                return response.json();

            } else {
                console.log('nok');
            }
        })
        .then(tarefa => {
            if (tarefa.length === 0) {
                console.log('Não existe');
            } else {
                console.log(tarefa);


                if (tarefa.coment !== null) {
                    // console.log(tarefa.coment);

                    const inputComentario = document.getElementById("inputComentario");
                    const valueComent = document.getElementById('valueComent');
                    // console.log(inputComentario.style.display);

                    inputComentario.style.display = "flex";
                    valueComent.value = tarefa.coment;
                    // console.log(valueComent);
                    
                    
                }
                

                const inputTitle = document.getElementById("inputNameTask");
                inputTitle.value = tarefa.task_title;

                const statusSpan = document.getElementById("statusSpan");
                statusSpan.textContent = tarefa.task_status.charAt(0).toUpperCase() + tarefa.task_status.slice(1); //Deixa o começo em maiusculo
                statusSpan.classList.add(tarefa.task_status.replace(/\b(a|em)\b/g, '').trim()) //Tira o 'em' da classe

                const prioSpan = document.getElementById("prioSpan");
                prioSpan.textContent = tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1);;
                prioSpan.classList.add(tarefa.task_prior);

                const inputSala = document.getElementById("inputSala");
                inputSala.value = tarefa.task_sala;

                const inputRespon = document.getElementById("inputRespon");
                inputRespon.value = tarefa.task_respon;

                const inputData = document.getElementById("inputData");
                function converterParaISO(dataBr) {
                    const [dia, mes, ano] = dataBr.split('/'); // Divide a string em partes
                    return `${ano}-${mes}-${dia}`; // Reorganiza para o formato ISO
                }
                const data = converterParaISO(tarefa.task_prazo);
                inputData.value = data;

                const descricao = document.getElementById("descricao");
                descricao.value = tarefa.task_text;



                console.log(tarefa.id_image + "<-----");

                idImage = tarefa.id_image;


                return tarefa;
            }
        })
        .then(image => {
            // console.log(image.id_image);
            fetch(`http://10.116.75.167:3000/getImage/${image.id_image}`)
                .then(response => {
                    if (response.ok) {
                        return response.blob(); // Obtém a imagem como um Blob
                    } else {
                        throw new Error("Erro ao buscar a imagem");
                    }
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob); // Cria uma URL para o Blob
                    const imgTag = document.querySelector("#imgUpload");
                    imgTag.src = url; // Define o src da tag <img>
                    console.log(imgTag.src);
                })
                .catch(error => {
                    console.error("Erro ao carregar a imagem:", error);
                });

            // Outros campos do chamado podem ser usados aqui
            // {call[0].id_image}, {call[0].sala}, {call[0].text}, etc.
        }
        )
        .catch(error => {
            console.error('Erro ao processar os chamados:', error);
        });
}





// ----------------------------
async function updateTask(idUser, idTask) {
    let inputTitle = document.getElementById("inputNameTask").value;

    let statusSpan = document.getElementById("statusSpan");
    statusSpan = statusSpan.textContent.charAt(0).toLowerCase() + statusSpan.textContent.slice(1);

    let prioSpan = document.getElementById("prioSpan");
    prioSpan = prioSpan.textContent.charAt(0).toLowerCase() + prioSpan.textContent.slice(1);

    let inputSala = document.getElementById("inputSala").value;

    let inputRespon = document.getElementById("inputRespon").value;

    let inputData = document.getElementById("inputData").value;
    function converterParaDataBrasileira(dataISO) {
        const [ano, mes, dia] = dataISO.split('-'); // Divide a string em partes
        return `${dia}/${mes}/${ano}`; // Reorganiza para o formato dd/mm/yyyy
    }
    inputData = converterParaDataBrasileira(inputData);

    let descricao = document.getElementById("descricao").value;
    
    let inputComentario = document.getElementById("inputComentario");
    const estilo = window.getComputedStyle(inputComentario); 
    
    console.log(estilo.display);
    
    
    
    if (estilo.display === 'flex') {
        let valueComent = document.getElementById("valueComent").value;
        
        console.log(valueComent);

        fetch(`http://10.116.75.167:3000/coment/${idTask}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valueComent, idTask })
        
    })
        .then(response => {
            if (response.status === 200) {
                alert('Tarefa atualizada com sucesso')
                console.log('Tarefa atualizada com sucesso');
                // return response.json();
            } else {
                alert('Erro ao atualizar a tarefa');
                throw new Error('Erro ao atualizar a tarefa');
            }
        })
        
    }


    console.log(idImage);

    if (!selectedFile) {
        console.log("Nenhuma imagem selecionada");
    } else {

        fetch(`http://10.116.75.167:3000/getImage/delete/${idImage}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.status === 200) {
                    // alert("Imagem deletada com sucesso!");
                    // Aqui você pode recarregar a lista de tarefas
                    console.log(`Imagem ${idImage} deletada!`);
                } else if (response.status === 404) {
                    alert("Imagem não encontrada.");
                } else {
                    alert("Erro ao deletar a Imagem.");
                }
                return response.json();
            })
            .catch((err) => {
                console.error("Erro na exclusão da Imagem:", err);
            });


        // Cria o FormData com a imagem
        const formData = new FormData();
        formData.append("image", selectedFile); // Envia apenas a imagem

        try {
            const response = await fetch("http://10.116.75.167:3000/upload-image", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                idImage = result.imageId; // Armazena o ID na variável global
                // alert("Imagem enviada com sucesso! ID: " + imageId);
                console.log("imagem: " + idImage);

                // createTask(idUser);

            } else {
                alert("Erro ao enviar imagem.");
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);
            alert("Err  o ao enviar a imagem.");
        }



    }





    fetch(`http://10.116.75.167:3000/tasks/updateTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUser, idTask, inputTitle, statusSpan, prioSpan, inputData, inputSala, inputRespon, descricao, idImage })
    })
        .then(response => {
            if (response.status === 200) {
                alert('Tarefa atualizada com sucesso')
                console.log('Tarefa atualizada com sucesso');

                const urlParams = new URLSearchParams(window.location.search);

                // Verifica se o parâmetro 'source' tem o valor 'taskManager'
                if (urlParams.get('source') === 'taskManager') {
                    window.location.href = 'http://10.116.75.167:13542/Front/pages/taskManager.html';
                }

                if (urlParams.get('source') === 'taskColab') {
                    window.location.href = 'http://10.116.75.167:13542/Front/pages/taskColab.html';
                }

                // return response.json();
            } else {
                alert('Erro ao atualizar a tarefa');
                throw new Error('Erro ao atualizar a tarefa');
            }
        })
        .then(dados => {
            console.log(idTask);
            console.log(inputTitle);
            console.log(statusSpan);
            console.log(prioSpan);
            console.log(inputRespon);
            console.log(inputSala);
            console.log(inputData);
            console.log(descricao);
            console.log(idImage);
        })
}

function deleteTask(idUser, idTask) {
    if (confirm("Tem certeza de que deseja deletar esta tarefa?")) {
        fetch(`http://10.116.75.167:3000/user/${idUser}/tasks/${idTask}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Tarefa deletada com sucesso!");
                    // Aqui você pode recarregar a lista de tarefas
                    console.log(`Tarefa ${idTask} deletada!`);


                    fetch(`http://10.116.75.167:3000//getImage/delete/${idImage}`, {
                        method: "DELETE"
                    })
                        .then(resposta => {
                            if (resposta.ok) {
                                alert(`Imagem ${idImage} deletada`)
                                console.log(`Imagem ${idImage} deletada.`);
                            } else {
                                throw new Error("Erro ao deletar a imagem");
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao deletar a imagem:", error);
                        });

                } else if (response.status === 404) {
                    alert("Tarefa não encontrada.");
                } else {
                    alert("Erro ao deletar a tarefa.");
                }

                const urlParams = new URLSearchParams(window.location.search);

                // Verifica se o parâmetro 'source' tem o valor 'taskManager'
                if (urlParams.get('source') === 'taskManager') {
                    window.location.href = 'http://10.116.75.167:13542/Front/pages/taskManager.html';
                }

                if (urlParams.get('source') === 'taskColab') {
                    window.location.href = 'http://10.116.75.167:13542/Front/pages/taskColab.html';
                }


                return response.json();
            })
            .catch((err) => {
                console.error("Erro na exclusão da tarefa:", err);
            });
    }
}

document.getElementById('addTaskAdicionar').addEventListener('click', () => {
    updateTask(idUser, idTask);
});

document.getElementById('addTaskDeletar').addEventListener('click', () => {
    deleteTask(idUser, idTask)
})

