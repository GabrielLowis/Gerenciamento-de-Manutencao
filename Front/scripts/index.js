
let idUser = localStorage.getItem('idUser');
let nivel = localStorage.getItem('nivel');

window.editStatus = function (idTask) {
    console.log(idTask);
};

window.onload = () => {
    console.log("nivel" + nivel);
    getUserName(idUser);
    getUserTask();
}

export function getUserName(idUser) {
    fetch(`http://10.116.81.5:3000/user/${idUser}`)
        .then(response => {
            if (response.status === 200) {
                console.log(response.json());
                console.log(idUser);

            } else {
                console.log('nok');
            }
        })
}


// if (nivel === 1) {

// }

// ----------------------------
export function getUserTask() {
    fetch(`http://10.116.81.5:3000/tasks`)
        .then(response => {
            if (response.status === 200) {
                return response.json();

            } else {
                console.log('nok');
            }
        })
        .then(tarefas => {
            if (tarefas.length === 0) {
                document.querySelector('#tableTasks').style.display = 'none';
            } else {
                let contadorFazer = 0;
                let contadorAndamento = 0;
                let contadorConcluida = 0;
                let contadorArquivada = 0;

                console.log(tarefas.length);


                tarefas.forEach(tarefa => {

                    const tbody = document.querySelector('#tbody');
                    if (tbody) {
                        let htmlTask = `<tr>
                                        <td class="tarefas"><a href="../pages/infoTask.html?source=taskManager" onclick="storeTaskId(${tarefa.id})">${tarefa.task_title}</a></td>
                                        <td class="status" onclick="editStatus(${tarefa.id})" > <span class="${tarefa.task_status}">${tarefa.task_status.charAt(0).toUpperCase() + tarefa.task_status.slice(1)}</span></td>
                                        <td class="responsavel"><a href="#">${tarefa.task_respon.charAt(0).toUpperCase() + tarefa.task_respon.slice(1)}</a></td>
                                        <td class="prazo"><span class="spanPrazo">${tarefa.task_prazo}</span></td>
                                        <td class="prioridade"><span class="${tarefa.task_prior}">${tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1)}</span></td>
                                        <td class="descricao">${tarefa.task_text}</td>
                                    </tr>`;
                                    tbody.innerHTML += htmlTask;

                        console.log('idTask: ' + tarefa.id);
                    }


                    const containerFazer = document.querySelector('#container.fazer');
                    if (containerFazer) {
                        if (tarefa.task_status === "a fazer") {
                            let htmlTaskQuadroFazer = `
                                <div class="taskFazer">
                                    <h2 class="tarefas"><a href="../pages/infoTask.html?source=taskQuadroManager" onclick="storeTaskId(${tarefa.id})">${tarefa.task_title}</a></h2>
                                    <h2 class="responsavel"><a href="#">${tarefa.task_respon.charAt(0).toUpperCase() + tarefa.task_respon.slice(1)}</a></h2>
                                    <span class="${tarefa.task_prior}">${tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1)}</span>
                                </div>
                            `;
                            containerFazer.innerHTML += htmlTaskQuadroFazer;

                            const contFazer = document.querySelector('#contFazer');

                            contadorFazer += 1;

                            contFazer.textContent = contadorFazer;
                        }
                    }


                    const containerAndamento = document.querySelector('#container.andamento');
                    if (containerAndamento) {
                        if (tarefa.task_status === 'em andamento') {
                            let htmlTaskQuadroAndamento = `
                                <div class="taskAndamento">
                                    <h2 class="tarefas"><a href="../pages/infoTask.html?source=taskQuadroManager" onclick="storeTaskId(${tarefa.id})">${tarefa.task_title}</a></h2>
                                    <h2 class="responsavel"><a href="#">${tarefa.task_respon.charAt(0).toUpperCase() + tarefa.task_respon.slice(1)}</a></h2>
                                    <span class="${tarefa.task_prior}">${tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1)}</span>
                                </div>
                            `;
                            containerAndamento.innerHTML += htmlTaskQuadroAndamento;

                            const contAndamento = document.querySelector('#contAndamento');

                            contadorAndamento += 1;

                            contAndamento.textContent = contadorAndamento;

                        }
                    }

                    const containerConcluida = document.querySelector('#container.concluida');
                    if (containerConcluida) {
                        if (tarefa.task_status === 'concluida') {
                            let htmlTaskQuadroConcluido = `
                                <div class="taskConcluida">
                                    <h2 class="tarefas"><a href="../pages/infoTask.html?source=taskQuadroManager" onclick="storeTaskId(${tarefa.id})">${tarefa.task_title}</a></h2>
                                    <h2 class="responsavel"><a href="#">${tarefa.task_respon.charAt(0).toUpperCase() + tarefa.task_respon.slice(1)}</a></h2>
                                    <span class="${tarefa.task_prior}">${tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1)}</span>
                                </div>
                            `;
                            containerConcluida.innerHTML += htmlTaskQuadroConcluido;

                            const contConcluida = document.querySelector('#contConcluida');

                            contadorConcluida += 1;

                            contConcluida.textContent = contadorConcluida;
                        }
                    }

                    const containerArquivado = document.querySelector('#container.arquivada');
                    if (containerArquivado) {
                        if (tarefa.task_status === 'arquivada') {
                            let htmlTaskQuadroArquivado = `
                                <div class="taskArquivada">
                                    <h2 class="tarefas"><a href="../pages/infoTask.html?source=taskQuadroManager" onclick="storeTaskId(${tarefa.id})">${tarefa.task_title}</a></h2>
                                    <h2 class="responsavel"><a href="#">${tarefa.task_respon.charAt(0).toUpperCase() + tarefa.task_respon.slice(1)}</a></h2>
                                    <span class="${tarefa.task_prior}">${tarefa.task_prior.charAt(0).toUpperCase() + tarefa.task_prior.slice(1)}</span>
                                </div>
                            `;
                            containerArquivado.innerHTML += htmlTaskQuadroArquivado;

                            const contArquivada = document.querySelector('#contArquivada');

                            contadorArquivada += 1;

                            contArquivada.textContent = contadorArquivada;
                        }
                    }
                    

                    const tasks = document.getElementById("tasks");
                        
                    if (tasks) {
                        const [dia, mes, ano] = tarefa.task_prazo.split("/");
                        const dataApi = new Date(ano, mes - 1, dia); // Mês começa do zero (Janeiro = 0)
                        
                        // Obter a data atual (apenas ano, mês e dia)
                        const hoje = new Date();
                        hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar só a data
                        
                        // Comparação
                        if (dataApi > hoje) {
                            console.log("A data está no futuro.");
                        } else if (dataApi < hoje) {
                            const spanPrazo =  tasks.querySelectorAll(".spanPrazo");
                            spanPrazo[spanPrazo.length - 1].classList.add("foraPrazo");
                            console.log("A data já passou.");
                            console.log(spanPrazo);
                            
                        }
                    }
                });
            }
        })
}