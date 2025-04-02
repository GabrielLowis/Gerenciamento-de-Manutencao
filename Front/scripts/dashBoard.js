var options = {
    chart: {
        type: 'pie',
        height: 350,
        background: 'transparent',
        events: {
            mounted: function (chartContext) {
                // 🔥 Remove a div da legenda depois que o gráfico for carregado
                setTimeout(() => {
                    document.querySelectorAll(".apexcharts-legend").forEach(el => el.remove());
                }, 100);
            }
        }
    },
    series: [62.5, 37.5],
    labels: ['Dentro do prazo', 'Fora do prazo'],
    colors: ['#00FF00', '#FF0000'], // Verde e Vermelho
    dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
            return val.toFixed(1) + "%";
        },
        style: {
            fontSize: '14px',
            colors: ['#fff'],
            fontFamily: 'Poppins',
        },
        dropShadow: {
            enabled: false
        }
    },
    tooltip: {
        enabled: false // Desativar o tooltip padrão
    },
    stroke: {
        show: false // Remove bordas brancas entre os setores
    },
    legend: {
        show: false // Remove legenda (mas às vezes a div é criada mesmo assim)
    }
};

var chart = new ApexCharts(document.querySelector("#graphicDoneOnTime"), options);
chart.render();

//-----------------------------------

var options = {
    chart: {
        type: 'pie',
        height: 320,
        background: 'transparent',
        events: {
            mounted: function (chartContext) {
                setTimeout(() => {
                    document.querySelectorAll(".apexcharts-legend").forEach(el => el.remove());
                }, 100);
            }
        }
    },
    series: [50, 30, 20], // 🔥 Valores iniciais (Realizados, Abertos, Arquivados)
    labels: ['Realizados', 'Abertos', 'Arquivados'],
    colors: ['#00FF00', '#FF0000', '#676767'], // Verde, Vermelho e Cinza
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(1) + "%";
        },
        style: {
            fontSize: '14px',
            colors: ['#fff'],
            fontFamily: 'Poppins',
        },
        dropShadow: {
            enabled: false
        }
    },
    tooltip: {
        enabled: false
    },
    stroke: {
        show: false
    },
    legend: {
        show: false
    }
};

var chart = new ApexCharts(document.querySelector("#graphicEfficiencyRate"), options);
chart.render();

// 🔥 Função para atualizar os valores do gráfico dinamicamente
function atualizarTaxaEficiência(novoRealizados, novoAbertos, novoArquivados) {
    chart.updateSeries([novoRealizados, novoAbertos, novoArquivados]);
}

// Exemplo: Mudar valores depois de 3 segundos
setTimeout(() => {
    atualizarTaxaEficiência(58.8, 35.3, 5.9); // Novo exemplo de valores
}, 3000);

//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const monthNames = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ];

    function generateCalendar(year, month) {
        const daysContainer = document.getElementById("days");
        const monthTitle = document.getElementById("month");

        // Limpa o calendário
        daysContainer.innerHTML = "";

        // Define o mês atual no título
        monthTitle.textContent = monthNames[month];

        // Obtém o primeiro dia do mês e a quantidade total de dias
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Segunda...
        const totalDays = new Date(year, month + 1, 0).getDate(); // Último dia do mês

        // Criando os dias vazios antes do primeiro dia do mês
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("empty-day");
            daysContainer.appendChild(emptyDiv);
        }

        // Criando os dias do mês
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.textContent = day;

            // Deixa os dias passados com opacidade reduzida
            const currentDate = new Date(year, month, day);
            if (currentDate < today.setHours(0, 0, 0, 0)) {
                dayDiv.classList.add("past-day");
            }

            // Evento para marcar os dias ao clicar
            dayDiv.addEventListener("click", function () {
                toggleDaySelection(dayDiv, day);
            });

            daysContainer.appendChild(dayDiv);
        }
    }

    function toggleDaySelection(dayDiv, day) {
        const topicsCalendar = document.getElementById("topicsCalendar");

        if (dayDiv.classList.contains("selected")) {
            dayDiv.classList.remove("selected");
            removeTopic(day);
        } else {
            dayDiv.classList.add("selected");
            addTopic(day);
        }
    }

    function addTopic(day) {
        const topicsCalendar = document.getElementById("topicsCalendar");

        const topicDiv = document.createElement("div");
        topicDiv.classList.add("topic");
        topicDiv.dataset.day = day;

        const span = document.createElement("span");
        span.textContent = day;

        const link = document.createElement("a");
        link.textContent = "Título da tarefa";

        topicDiv.appendChild(span);
        topicDiv.appendChild(link);
        topicsCalendar.appendChild(topicDiv);
    }

    function removeTopic(day) {
        const topicsCalendar = document.getElementById("topicsCalendar");
        const topicToRemove = topicsCalendar.querySelector(`.topic[data-day="${day}"]`);
        if (topicToRemove) {
            topicsCalendar.removeChild(topicToRemove);
        }
    }

    // Obtém a data atual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Gera o calendário
    generateCalendar(currentYear, currentMonth);
});