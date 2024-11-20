import { 
    fill_user_info, 
    fillPlatesList,
    getUserInfoOfMonth,
    getDataToTodayPage,
    monthpickerFunction,
    confirm_plate,
    add_selector,
    remove_selector,
    set_user_info,
    highlight_foods,
    get_current_date,
    messageForUser,
} from "./supabase_utils.js"

// Preenche os dados do usuãrio
fill_user_info()

// Preenche a lista de pratos do dia
fillPlatesList();

// Pega os dados do mës do usuário
getUserInfoOfMonth(get_current_date());

// Pega os dados para a pãgina de informações do dia
getDataToTodayPage()

// Preenche a lista de pratos do dia
fillPlatesList();

// Preenche o gráfico de peso com os dados do mês atual
monthpickerFunction()

// Adiciona um evento de clique ao botão de confirmar prato
document.getElementById('confirmar_prato').addEventListener('click', confirm_plate)

// Adiciona a função para adicionar mais seletores de alimentos ao botão "mais_alimentos"
document.getElementById("mais_alimentos").addEventListener("click", add_selector);

// Adiciona a função para remover seletores de alimentos ao botão "menos_alimentos"
document.getElementById("menos_alimentos").addEventListener("click", remove_selector);

// Adiciona o evento ao botão de atualizar os dados do usuário
document.getElementById('confirmar').addEventListener('click', set_user_info);

$(document).ready(function () {
    // Inicialize o Monthpicker
    $("#monthpicker").datepicker({
        format: "mm/yyyy",
        minViewMode: "months",
        autoclose: true,
        altField: "#dateHidden",
        onClose: function (dateText, inst) {
            var selectedDate = $(this).datepicker("getDate");
            var selectedMonth = $.datepicker.formatDate("mm", selectedDate);
        }
    }).on("changeDate", function (e) {
        monthpickerFunction(e.date);
    });

    // Abrir manualmente o Monthpicker quando o campo de entrada for clicado
    $("#monthpicker").on("click", function () {
        $(this).datepicker("show");
    });
});

// Exibe as mensagens de carregamento iniciais
var elements = ["mensagem_hoje", "mensagem_refeicoes_hoje"]//, "mensagem_mes"]
for (var i in elements) {
    messageForUser(document.getElementById(elements[i]), "Carregando dados...", "info", 100);
}


d3.select("#filtro_textual_" + 1)
                .on("change",
                    function () {
                        highlight_foods();
                    }
                );

var tabsChats = document.querySelectorAll('.tabs_charts.nav-link');
tabsChats.forEach(function (tab) {
    tab.addEventListener('click', function (event) {
        event.preventDefault();

        // Obtém o conteúdo alvo (pane) associado à tab
        var target = document.querySelector(this.getAttribute('href'));

        // Remove a classe 'active' de todas as tabs
        var activeTabs = document.querySelectorAll('.tabs_charts.nav-link.active');
        activeTabs.forEach(function (activeTab) {
            activeTab.classList.remove('active');
        });

        // Remove as classes 'show' e 'active' de todas as panes
        var activePanes = document.querySelectorAll('.tabs_charts.tab-pane.fade.show.active');
        activePanes.forEach(function (activePane) {
            activePane.classList.remove('show', 'active');
            activePane.classList.add('not_visible');
        });

        // Adiciona a classe 'active' na tab clicada
        this.classList.add('active');

        // Adiciona as classes 'show' e 'active' na pane correspondente
        target.classList.add('show', 'active');
        target.classList.remove('not_visible');
    });
});

// Seletores de tabs para as páginas
var tabsPages = document.querySelectorAll('.tabs_pages.nav-link');
tabsPages.forEach(function (tab) {
    tab.addEventListener('click', function (event) {
        event.preventDefault();

        // Obtém o conteúdo alvo (pane) associado à tab
        var target = document.querySelector(this.getAttribute('href'));

        // Remove a classe 'active' de todas as tabs
        var activeTabs = document.querySelectorAll('.tabs_pages.nav-link.active');
        activeTabs.forEach(function (activeTab) {
            activeTab.classList.remove('active');
        });

        // Remove as classes 'show' e 'active' de todas as panes
        var activePanes = document.querySelectorAll('.tabs_pages.tab-pane.fade.show.active');
        activePanes.forEach(function (activePane) {
            activePane.classList.remove('show', 'active');
            activePane.classList.add('not_visible');
        });

        // Adiciona a classe 'active' na tab clicada
        this.classList.add('active');

        // Adiciona as classes 'show' e 'active' na pane correspondente
        target.classList.add('show', 'active');
        target.classList.remove('not_visible');
    });
});


// Seletores de tabs para os micro nutrientes
var tabsMicroNutrients = document.querySelectorAll('.today_tab.nav-link');
tabsMicroNutrients.forEach(function (tab) {
    tab.addEventListener('click', function (event) {
        event.preventDefault();

        // Obtém o conteúdo alvo (pane) associado à tab
        var target = document.querySelector(this.getAttribute('href'));

        // Remove a classe 'active' de todas as tabs
        var activeTabs = document.querySelectorAll('.today_tab.nav-link.active');
        activeTabs.forEach(function (activeTab) {
            activeTab.classList.remove('active');
        });

        // Remove as classes 'show' e 'active' de todas as panes
        var activePanes = document.querySelectorAll('.today_tab.tab-pane.fade.show.active');
        activePanes.forEach(function (activePane) {
            activePane.classList.remove('show', 'active');
            activePane.classList.add('not_visible');
        });

        // Adiciona a classe 'active' na tab clicada
        this.classList.add('active');

        // Adiciona as classes 'show' e 'active' na pane correspondente
        target.classList.add('show', 'active');
        target.classList.remove('not_visible');
    });
});

// Adiciona um evento a todos os botões da classe nav-link
var nav_links = document.getElementsByClassName("nav-link");

// Itera sobre os elementos da coleção nav_links
for (var i = 0; i < nav_links.length; i++) {
    // Adiciona o evento de clique a cada elemento
    nav_links[i].addEventListener("click", function () {
        // Obtém a div de id #matrix_tooptip
        var matrix_tooltip = document.getElementById("matrix_tooltip");

        if (matrix_tooltip) {
            // Fecha a div
            matrix_tooltip.style.visibility = "hidden";

            // Fecha o pai da div
            matrix_tooltip.parentElement.style.visibility = "hidden";
        }
    });
}