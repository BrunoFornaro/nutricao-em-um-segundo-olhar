// Supabase
import { supabase, user_id } from './supabase_init.js'

// Dados dos alimentos
var data = await readCSV("archive/tabela.csv");

// Ids dos campos em objetivos
var fieldIds = [
    "weight",
    "last_weight",
    "daily_calories",
    "carbs_percent",
    "lipids_percent",
    "protein_percent",
    "tolerance",
    "num_daily_plates"
];

// Lê os dados do csv archive/macronutrientes.csv
async function readCSV(file) {
    // Lê o arquivo csv
    var csv = await fetch(file);

    // Converte o arquivo csv para texto
    var text = await csv.text();

    const lines = text.split('\n');
    const headers = lines[0].split(',');

    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        const obj = {};

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = line[j];
        }

        result.push(obj);
    }

    return result;
}

export function messageForUser(element, message, type = "success", duration = 3) {
    // Escreve a mensagem
    element.innerHTML = message;
    // Define a cor da mensagem
    var types = ["success", "danger", "warning", "info"];
    element.classList.add("alert", "alert-" + type);
    for (var i = 0; i < types.length; i++) {
        if (type != types[i]) {
            element.classList.remove("alert-" + types[i]);
        }
    }

    // Remove a mensagem após o tempo definido
    setTimeout(function () {
        element.innerHTML = "";
        element.classList.remove("alert", "alert-" + type);
    }, duration * 1000);
}

export function get_current_date() {
    return new Date().toLocaleDateString('en-CA');
};

export function get_current_datetime() {
    return new Date().toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Usa o formato 24 horas
    });
};

export async function getLastUserInfoSupabase(
) {
    const {"data": last_user_info, error} = await supabase
        .rpc('get_last_user_info', {"var_user_id": user_id})

    return last_user_info;
}

export async function getUserInfoSupabase(
) {
    console.log('get_user_info')
    const {"data": user_info, error} = await supabase
        .rpc('get_user_info', {"var_user_id": user_id, "var_date": get_current_date()})
    console.log(user_info)

    return user_info;
}

export async function fill_user_info() {
    // Recupera os dados do usuário
    await getLastUserInfoSupabase()
        .then((user_info) => {
            user_info = user_info['0']
            // Recupera os dados do documento (testes)
            console.log('user_info', user_info)
            if (user_info != null) {
                if (user_info["initial"] == false) {
                    fieldIds.forEach(function (fieldId) {
                        // Define o valor do elemento como o valor no banco de dados
                        document.getElementById(fieldId).value = user_info[fieldId];
                    });
                }
                console.log("Dados do usuário recuperados com sucesso")
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.error("Erro ao recuperar os dados:", error);
        });
}

export async function set_user_info() {
    const mensagem_objetivos = document.getElementById('mensagem_objetivos');
    messageForUser(mensagem_objetivos, "Atualizando...", "info", 10);

    // Recupera os dados do usuário
    var data = {};

    fieldIds.forEach(function (fieldId) {
        var value = parseFloat(document.getElementById(fieldId).value);
        if (isNaN(value)) {
            var placeholder = document.getElementById(fieldId).placeholder;
            data[fieldId] = placeholder;
        } else {
            data[fieldId] = value;
        }
    });

    // Adiciona as demais informações
    data['user_id'] = user_id
    data['updated_at'] = get_current_datetime()
    data['initial'] = 0

    await supabase
        .from('user_infos_history')
        .upsert([data], { onConflict: ['user_id', 'updated_at'] })
        .then(() => {
            console.log("Documento atualizado com sucesso!");
            // Exibe a mensagem de sucesso
            messageForUser(mensagem_objetivos, "Atualizado com sucesso!", "success", 3);
        })
        .catch((error) => {
            // Ocorreu um erro ao gravar no Supabase
            console.error("Erro ao criar o documento: ", error);


            // Exibe a mensagem de falha
            messageForUser(mensagem_objetivos, "Houve algum problema ao atualizar :(", "danger", 5);
        });
}

export async function confirm_plate() {
    // Exibe a mensagem de prato confirmado
    const mensagemElement = document.getElementById("mensagem_confirmar_prato");
    messageForUser(mensagemElement, "Confirmando prato...", "info", 20);

    // Obtém a quantidade de alimentos no prato
    var qtd_alimentos = document.getElementsByClassName('filtro_textual').length;

    var {"data": num_plates, error} = await supabase.rpc("num_plates", {var_user_id: user_id})

    // Variável para verificar se um alimento foi selecionado
    var has_food = false;

    var plates = []

    // Variáveis de tempo
    const date = get_current_date();
    const datetime = get_current_datetime();

    // Itera pelos alimentos
    for (var i = 1; i <= qtd_alimentos; i++) {
        // Obtém o nome do alimento
        var nome_alimento = document.getElementById('filtro_textual_' + i).value;
        // Obtém a quantidade do alimento
        var quantidade_alimento = document.getElementById('slider_alimento_' + i).value;

        // Verifica se o nome do alimento não é vazio
        if (nome_alimento) {
            has_food = true;
            // Cria (ou atualiza) o documento para o usuário no Supabase (atual)
            plates.push({
                user_id: user_id,
                date_brt: date,
                plate: num_plates,
                food: i,
                hour: datetime,
                name: nome_alimento,
                quantity: quantidade_alimento,
            })
        }
    }

    // Cria (ou atualiza) o documento para o usuário no Supabase (atual)
    await supabase
        .from("plates")
        .upsert(plates)
        .then(() => {
            console.log("Documento atualizado com sucesso!");
            getDataToTodayPage();
            fillPlatesList();
            // Exibe a mensagem de prato confirmado em um alerta verde flutuante
            messageForUser(mensagemElement, "Prato confirmado!", "success", 3);
        })
        .catch((error) => {
            // Ocorreu um erro ao gravar no Supabase
            console.error("Erro ao criar o documento: ", error);

            // Exibe a mensagem de erro em um alerta vermelho flutuante
            messageForUser(mensagemElement, "Houve algum problema ao confirmar o prato :(", "danger", 5);
        });

    // Exibe uma mensagem de que nenhum alimento foi adicionado
    if (!has_food) {
        messageForUser(mensagemElement, "Nenhum alimento foi adicionado!", "danger", 5);
    }
}

// Função para pegar os filhos de um elemento
export function get_children(element) {
    var children = [];
    var child = element.firstChild;
    while (child) {
        if (child.nodeType == 1) {
            children.push(child);
        }
        child = child.nextSibling;
    }
    return children;
}

// Função para adicionar mais seletores de alimentos
export function add_selector() {
    // Cria um novo elemento de seleção de alimentos
    var new_selector = document.createElement("div");
    // Obtém o número de seletores de alimentos já existentes
    var num_selectors = get_children(document.getElementById("alimentos_do_prato")).length;
    var num = num_selectors + 1;
    // Adiciona o id ao novo elemento de seleção de alimentos
    new_selector.id = "seletor_alimentos_" + num;
    new_selector.innerHTML = `
        <!-- Seletor ` + num + ` -->
        <div class="row">
            <div class="col-md-6">
                <!-- Dropdown com a lista de alimentos junto do campo de filtro textual -->
                <input type="search" list="lista_alimentos" id="filtro_textual_` + num + `" 
                placeholder="Escolha um alimento :)" class="filtro_textual">
                <datalist id="lista_alimentos"></datalist>
            </div>
            <div class="col-md-6">
                <p id="alimento_` + num + `">
                    <input type="range" id="slider_alimento_` + num + `" value="0" min="0" max="300"
                        oninput="this.nextElementSibling.value = this.value">
                    <input type="text" id="quantidade_alimento_` + num + `" value="0" 
                    oninput="this.previousElementSibling.value = this.value" class="quantidade_alimento">
                    g
                </p>
            </div>
        </div>
    `
    // Adiciona o novo elemento de seleção de alimentos ao final da lista de seletores de alimentos
    document.getElementById("alimentos_do_prato").appendChild(new_selector);

    d3.select("#filtro_textual_" + num)
        .on("change",
            function () {
                highlight_foods();
            }
        );
}

export function get_selected_foods(data) {
    // Obtém a lista os alimentos selecionados
    // Obtém o número de seletores de alimentos já existentes
    var num_selectors = get_children(document.getElementById("alimentos_do_prato")).length;
    var selected_food = data.filter( // filtra os alimentos selecionados
        function (d) {
            // Para cada seletor existente
            for (let num = 1; num <= num_selectors; num++) {
                // Se o seletor tiver um alimento selecionado e o valor for igual d.Nome
                if (document.getElementById("filtro_textual_" + num).value == d.Nome) {
                    // Retorna os dados do alimento que foi selecionado
                    return d;
                }
            }
        }
    );
    
    return selected_food;
}

export const secondary_bg_color="#FDFCFC";
export const principal_bg_color="#9DDFBB";
export const highlight_color = "#035931";

export function highlight_foods() {
    var selected_food = get_selected_foods(data);
    var columns = ["Carboidrato (g)", "Proteína (g)", "Lipídeos (g)"];
    
    // Pinta todas as barras com a cor padrão
    for (let col = 0; col < 3; col++) {
        var coluna = columns[col];
        for (let food = 0; food < data.length; food++) {
            d3.select("#violinplot_bar_" + col + "_" + Math.floor(data[food][coluna])).attr("fill", principal_bg_color);
        }
    }
    for (let i = 0; i < selected_food.length; i++) {
        var d = selected_food[i];

        // Highlight nas barras
        for (let col = 0; col < 3; col++) {
            var coluna = columns[col];
            console.log("#violinplot_bar_" + col + "_" + Math.floor(d[coluna]))
            d3.select("#violinplot_bar_" + col + "_" + Math.floor(d[coluna])).attr("fill", highlight_color);
        }
        // Highlight nas bolinhas
        d3.select("#circle_matrixchart_" + d.id).attr("fill", highlight_color);
    }
}

// Função para remover seletores de alimentos
export function remove_selector() {
    // Obtém o número de seletores de alimentos já existentes
    var num_selectors = get_children(document.getElementById("alimentos_do_prato")).length;
    // Se houver mais de um seletor de alimentos, remove o último
    if (num_selectors > 1) {
        document.getElementById("alimentos_do_prato").removeChild(document.getElementById("seletor_alimentos_" + num_selectors));
    }
}

// Função para preencher a lista de pratos do dia
export function fillPlatesList(plates) {
    // Exibe a mensagem de carregamento
    const message_element = document.getElementById('mensagem_refeicoes_hoje');
    messageForUser(message_element, 'Carregando...', "info", 100);

    // Chama a função assíncrona para obter todos os pratos
    getAllPlates().then(function (plates) {

        // Exemplo do html gerado
        `
        <div class="plates_container">
            <div class="row">
                <div class="col-md-12">
                    <h3>
                        Prato 1 - 07:35
                    </h3>
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p>
                        85g
                    </p>
                </div>
                <div class="col-md-10">
                    <p>
                        Arroz integral cozido
                    </p>
                </div>
            </div>
        </div>
        `

        function div_title_plate(num_plate, hour) {
            var div = `
                <div class="row">
                    <div class="col-md-12">
                        <h3>
                            Prato `+ (parseInt(num_plate) + 1) + ` - ` + hour + `
                        </h3>
                    </div>
                </div>`
            return div;
        }

        function div_food_of_plate(food_name, quantity) {
            var div = `
                <div class="row">
                    <div class="col-md-2">
                        <p>
                            `+ quantity + `g
                        </p>
                    </div>
                    <div class="col-md-10">
                        <p>
                            `+ food_name + `
                        </p>
                    </div>
                </div>`
            return div;
        }



        var html_string = ``;


        // Preenche a lista de pratos com os dados recuperados do firebase
        var plateIndex = 0;

        while (plateIndex < plates.length) {
            // Ultimo prato iterado
            var last_plate = plates[plateIndex]["plate"];

            // Itera pelos pratos
            // Abre a div do prato
            html_string += `<div class="plates_container">`;
            // Adiciona o título do prato
            html_string += div_title_plate(last_plate, plates[plateIndex]["hour"].slice(11,16));
            while (plateIndex < plates.length && last_plate == plates[plateIndex]["plate"]) {
                // Linha atual 
                var row = plates[plateIndex];

                // Adiciona o alimento ao prato
                html_string += div_food_of_plate(row["name"], row["quantity"]);

                plateIndex ++
            }
            // Fecha a div do prato
            html_string += `</div>`;
        };

        // Adiciona o elemento HTML
        document.getElementById("lista_pratos_do_dia").innerHTML = html_string;

        // Oculta a mensagem de carregamento
        messageForUser(message_element, '', "info", 0);
    });
}


export async function getAllPlates(date = get_current_date()) {
    const {"data": supabase_plates, error} = await supabase.rpc('get_all_plates', {"var_user_id": user_id, "var_date": date})
    return supabase_plates;
}

// Função para pegar todos os pratos do mês
export async function getAllPlatesInMonth(date=get_current_date()) {
    const {"data": plates, error} = await supabase
        .rpc(
            'get_all_plates_in_month', 
            {"var_user_id": user_id, "var_date": date}
        );

    return plates; // Retornar objeto de pratos
}

async function getUserInfo(
    date = get_current_date(),
) {
    console.log('try get_user_info')
    const {"data": user_info, error} = await supabase
        .rpc('get_user_info', {"var_user_id": user_id, "var_date": date})
    console.log('get_user_info', user_info)

    return user_info;
}

export async function getUserInfoOfMonth(date=get_current_date()) {
    const {data, error} = await supabase
        .rpc('get_user_info_in_month', {"var_user_id": user_id, "var_date": date})
    return data;
}

async function getNutritionalInfoOfPlatesInMonth(date=get_current_date()) {
    const {"data": plates_of_month, error} = await supabase
        .rpc("get_food_nutritional_info_in_month", {"var_user_id": user_id, "var_date": date});
    return plates_of_month;
}

async function getNutritionalInfoOfPlates(date=get_current_date()) {
    const {"data": plates_of_month, error} = await supabase
        .rpc("get_food_nutritional_info", {"var_user_id": user_id, "var_date": date});
    return plates_of_month;
}

async function getNutritionalInfoOfPlatesDaily(date=get_current_date()) {
    const {"data": plates_of_month, error} = await supabase
        .rpc("get_food_nutritional_info_daily", {"var_user_id": user_id, "var_date": date});
    return plates_of_month["0"];
}

async function getWeightOfMonth(date=get_current_date()) {
    const {"data": weigth, error} = await supabase
        .rpc('get_weight_in_month', {"var_user_id": user_id, "var_date": date})
    return weight;
}

async function getUserCurrentInfo() {
    // Retorna os dados do usuário
    return getLastUserInfoSupabase();
}

// Função do monthpicker
export async function monthpickerFunction(date=get_current_date()) {
    // Exibe a mensagem de carregamento
    const mensagem_element = document.getElementById("mensagem_data");
    messageForUser(mensagem_element, "Carregando... (isso pode demorar um pouco)", "info", 100);

    // Recupera os dados
    var {"data": data_to_linechart, error} = await supabase
        .rpc('linechart_data', {"var_user_id": user_id, "var_date": date})

    // Altera os índeces para 0, 1, 2, ...
    data_to_linechart = Object.values(data_to_linechart);

    // Pega o elemento para os dados do linechart
    var linechart_data = document.getElementById("micronutrientes_data");

    // Insere os dados no elemento como JSON (substitui o conteúdo anterior)
    linechart_data.value = JSON.stringify(data_to_linechart);

    // Dispara o evento change para o elemento
    var event = new Event("change");
    linechart_data.dispatchEvent(event);

    // Esconde a mensagem de carregamento
    messageForUser(mensagem_element, "", "success", 0);

    return data_to_linechart;
}

export async function getDataToTodayPage() {
    //Exibe a mensagem de carregamento
    const mensagem_element = document.getElementById("mensagem_hoje");
    messageForUser(mensagem_element, "Carregando dados...", "info", 60);

    var plates_nutritional_info = await getNutritionalInfoOfPlatesDaily();

    var minerals_data = [{
        "Cobre (mg)": plates_nutritional_info["Cobre (mg)"],
        "Ferro (mg)": plates_nutritional_info["Ferro (mg)"],
        "Fósforo (mg)": plates_nutritional_info["Fósforo (mg)"],
        "Manganês (mg)": plates_nutritional_info["Manganês (mg)"],
        "Sódio (mg)": plates_nutritional_info["Sódio (mg)"],
        "Zinco (mg)": plates_nutritional_info["Zinco (mg)"]
    }]

    var vitamins_data = [{
        "Tiamina (mg)": plates_nutritional_info["Tiamina (mg)"],
        "Riboflavina (mg)": plates_nutritional_info["Riboflavina (mg)"],
        "Piridoxina (mg)": plates_nutritional_info["Piridoxina (mg)"],
        "Niacina (mg)": plates_nutritional_info["Niacina (mg)"],
        "Vitamina C (mg)": plates_nutritional_info["Vitamina C (mg)"],
        "Retinol(µg)": plates_nutritional_info["Retinol(µg)"],
    }]

    var fat_data = [{
        'Saturados (g)': plates_nutritional_info['Saturados (g)'],
        "Monoinsaturados (g)": plates_nutritional_info["Monoinsaturados (g)"],
        "Poliinsaturados (g)": plates_nutritional_info["Poliinsaturados (g)"],
    }]

    var today_macros = [{
        "Carboidrato (g)": plates_nutritional_info["Carboidrato (g)"],
        "Proteína (g)": plates_nutritional_info["Proteína (g)"],
        "Lipídeos (g)": plates_nutritional_info["Lipídeos (g)"],
    }]

    // Converte os dados para JSON
    minerals_data = JSON.stringify(minerals_data);
    vitamins_data = JSON.stringify(vitamins_data);
    fat_data = JSON.stringify(fat_data);
    today_macros = JSON.stringify(today_macros);

    // Pega os elementos para os dados dos gráficos
    var minerals_data_element = document.getElementById("minerals_data");
    var vitamins_data_element = document.getElementById("vitamins_data");
    var fat_data_element = document.getElementById("fat_data");
    var today_macros_element = document.getElementById("macronutrientes_hoje_data");

    // Insere os dados nos elementos como JSON (substitui o conteúdo anterior)
    minerals_data_element.value = minerals_data;
    vitamins_data_element.value = vitamins_data;
    fat_data_element.value = fat_data;
    today_macros_element.value = today_macros;

    // Dispara o evento change para os elementos
    var event = new Event("change");
    minerals_data_element.dispatchEvent(event);
    vitamins_data_element.dispatchEvent(event);
    fat_data_element.dispatchEvent(event);
    today_macros_element.dispatchEvent(event);

    // Esconde a mensagem de carregamento
    messageForUser(mensagem_element, "", "success", 0);
}
