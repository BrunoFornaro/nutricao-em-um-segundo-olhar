[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CxFZefIP)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10840813&assignment_repo_type=AssignmentRepo)

## Nutrição em um Olhar

Trabalho elaborado pelos alunos Bruno Fornaro Pereira [Bruno Fornaro Pereira](https://github.com/BrunoFornaro) e [Vanessa Berwanger Wille](https://github.com/VanessaWille) para a disciplina de Visualização de Dados.. 

O tema escolhido para esse trabalho está relacionado à área de nutrição, onde procuramos evoluir o trabalho realizado para a tarefa 3 da disciplina.
O objetivo é possibilitar ao usuário um maior entendimento sobre os alimentos, filtragem dos mesmo de acordo com os macronutriente e compreender se suas escolhas alimentares estão balanceadas: "O conhecimento da composição dos alimentos consumidos no Brasil é fundamental para se alcançar a segurança alimentar e nutricional. As informações de composição de alimentos são pilares básicos para a educação nutricional e a avaliação da ingestão de nutrientes de indivíduos." (Tabela Brasileira de Composição de Alimentos – TACO, 4ª edição revisada e ampliada). 

 Os dados necessários foram obtidos através do Kaggle, sendo o dataset escolhido: [Composição nutricional de alimentos - TACO](https://www.kaggle.com/datasets/ispangler/composio-nutricional-de-alimentos-taco). Nele temos dados sobre a composição dos principais alimentos consumidos no Brasil, baseado em um plano de amostragem que garante valores representativos, com análises realizadas por laboratórios com capacidade analítica comprovada. 

### Uma visão geral do processo de desenvolvimento.

O processo de desenvolvimento foi feito em conjunto, onde cada um dos integrantes do grupo contribuiu com ideias e sugestões. A partir disso, foram feitos alguns esboços de como evoluir as visualizações já existentes, especialmente o filtro do gráfico de violino, que precisava lidar com uma quantidade maior de dados, e desenvolvidas novos gráficos usando a biblioteca D3.js:

- Violin plot para filtragem dos alimentos e análise das suas distribuições em relação aos macronutrientes.
- Gráfico de barras mostrando a adequação da refeição montada em relação ao plano nutricional especificado.
- Acompanhamento mensal do peso e do consumo de macronutrientes.
- Visualizações gerais do consumo micronutrientes e macronutrientes por dia:
  - Gráfico de barras dos macronutrientes.
  - Gráfico de barras do consumo de cada tipo de lipídeos.
  - Gráficos de barras de proporção para micronutrientes (minerais e vitaminas).
  
FALAR AQUI SOBRE A DIVISÃO DO TRABALHO.

Todo esse processo demandou bastante tempo dos integrantes e passamos por desafios, necessitando aprender muitas coisas novas, e aprendizados. 

### Tópicos das críticas:
- “Barra de peso poderia ser substituída por uma barra de desenvolvimento que além do peso mostrasse a evolução dos macros e vitaminas do usuário ao longo do tempo”: 
Alteramos o gráfico de linhas para também mostrar os macronutrientes. Isso realmente nos permite ter mais detalhamento da evolução do peso do usuário com relação a sua alimentação, dado que a quantidade de cada macronutriente ingerida está diretamente ligada às calorias ingeridas que, por sua vez, estão ligadas ao peso do usuário. Entretanto, não colocamos as vitaminas juntas no gráfico de linhas pois a visualização se tornaria muito poluída e acreditamos que isso não traria uma informação tão relevante para o usuário nesse contexto, dessa forma mantivemos apenas a visualização de vitaminas em outra aba, com o percentual para atingir o nível adequado (mínimo) de ingestão de calorias diárias.

- "Seria interessante uma área para adicionar gastos calóricos mesmo que só um número bruto para que possa ser deduzido da alimentação diária”: 
Agora existe um campo para o usuário preencher com sua meta de consumo calórico diário, assim esses valores pode ser alterado de acordo com seus objetivos.

- “Uma ideia interessante seria adicionar as informações do tutorial também em tooltips no preenchimento do usuário, para que caso apareçam dúvidas durante o preenchimento ele possa tirá-las sem ter que trocar de página”: 
As tooltips foram inseridas em elementos HTML com a função de hover para caso o usuário tenha dúvidas em cada parte da ferramenta.

- “Sugiro haver um modo de navegação anônima, sem registro, onde não guarde o histórico da pessoa, mas ela possa explorar o site.”:
O modo de navegação anônima acabaria por impedir de utilizarmos grande parte da ferramenta, então preferimos não criá-lo. Entretanto, não há verificação de e-mail para se cadastrar no site, logo é possível se cadastrar com um e-mail falso gerado aleatoriamente, o que pode gerar a experiência de navegação anônima (dado que seus dados não serão associados a sua conta e sim a uma conta fictícia). Devemos lembrar também que um modo de navegação anônima só significaria que você não precisa fazer um cadastro e também não precisa se identificar, mas não implica no site não salvar dados, logo acreditamos que isso atende às necessidades desse pedido.

- “Referente a visualização por dia: acho que seria legal não ter os "verdes" e "vermelhos" na barra de baixo - uma pessoa que ficou uma semana fora da dieta e teve muitos vermelhos pode acabar ficando ainda mais desmotivada vendo toda aquela quantidade de vermelhos gritantes. Também acho que o range do verde no gráfico das três barras poderia ser de outra cor, pelo mesmo motivo acima.”: 
Nós estamos representando os dados dessa forma pois foi a que melhor conseguimos para que o usuário recuperasse a informação da adequação de suas refeições. Nosso objetivo é manter o usuário informado. Esperamos que ao ver que ele não está se alimentando corretamente o usuário se sinta incentivado a mudar seus hábitos alimentares, e não que isso desincentive-o, mas não podemos controlar de forma específica esse tipo de reação psicológica de cada usuário. De toda forma, acreditamos que remover informação não tem como gerar mais incentivo, pois assim o usuário passa a desconhecer o problema que há.
Além disso, acreditamos que o range verde ajuda ao usuário notar a adequação dos macronutrientes, até mesmo porque estamos utilizando essa cor para representar adequação em basicamente todas as partes da ferramenta, quando necessário. A escolha dessas cores se deu pelo contexto, é comum ser utilizado vermelho para excesso, amarelo para escassez e verde para adequado (no nosso país e nesse contexto), então não queremos inserir um novo padrão para que o usuário precise se adaptar a ele.

- “Botar as fotos de comida acho que vai acabar poluindo a visualização - manter cores diferentes (verde para verduras, amarelo para carboidratos, por exemplo) acho que pode ser mais benéfico.”
Durante o MVP o gráfico ainda não estava implementado com as imagens. Após implementá-lo, acreditamos que as imagens não poluem a visualização, mas ajudam o usuário a identificar os alimentos no gráfico. Se apenas representassemos os alimentos por cores que representam categorias às quais eles pertencem, acabaríamos não conseguindo distinguir bem os alimentos da mesma classe. Para isso, também seria necessário classificar os alimentos, pois não temos dados de nenhuma categoria desse tipo. Além disso, a escolha desse gráfico foi em boa parte por uma questão estética e não somente para trazer um insight para o usuário, pois a imagens dos alimentos em um prato se adequa muito bem para o contexto da ferramenta. 

- “Referente ao fluxo no site, achei um pouco confuso, com diferentes acessos a tela em diferentes lugares: sugiro centralizar todos acessos em um menu só (como um de sanduíche que expande), a fim da experiência do usuário não ficar confusa.": 
A navegação com o menu sanduíche que expande foi removida, agora todos os campos de navegação são sempre visíveis e estão na forma de botões.

- “Tive certas complicações na hora de fazer login, pois os botões pareciam não responder corretamente. Ajudaria bastante colocar alguns avisos do tipo "registro feito com sucesso" ou "falha ao logar".”: 
Realmente havia um bug no login na etapa do MVP que algumas vezes impedia o cadastro de um novo usuário. O bug foi identificado e corrigido. Além disso, foram implementados os avisos de falha e sucesso dos processos (não somente do login e do registro, mas também de outras áreas que envolviam a conexão com o banco de dados na nuvem).

- “Para o gráfico de barras, não entendi muito bem se os valores adequados se referem à uma refeição, a um dia, etc, dado que não passamos o número de refeições por dia. Talvez uma explicação nessa aba explicando o escopo de referência.”: 
As informações de quantas refeições diárias são feitas são preenchidas pelo usuário no cadastro (e podem ser alteradas conforme as necessidades e objetivos do usuário mudem). Isso é explicado na página que explica o funcionamento da ferramenta e agora também há uma tooltip ao lago de cada campo que o usuário precisa preencher.

- “Particularmente, acho que as cores no gráfico de barras dos macronutrientes não estão acrescentando tanto na visualização, penso que se fossem barras empilhadas poderia ser interessante para visualizar o quanto cada ingrediente contribui de maneira separada.”: 
Para o nosso objetivo, de mostrar a adequação da alimentação do usuário, acreditamos que o gráfico de barras é mais útil para mostrar essa informação e também é mais simples para o usuário ver a variação conforme altera as informações do prato, ajudando a montar um prato adequado aos seus objetivos. Entretanto, agora também mostramos as informações da contribuição dos macronutrientes de cada alimento em tooltips, tanto no gráfico de pizza (o “gráfico de prato”) quanto no violinplot (em uma tooltip aninhada por um gráfico com uma matriz de pontos, que representa todos os alimentos em uma determinada faixa do violino de cada macronutriente).

- Também surgiram algumas críticas em relação ao violin plot, citando a falta de relação de um mesmo ponto nas diferentes colunas e a questão da base dos gráficos estarem 'encostando': Esse problemas foram resolvidos e o gráfico de violino foi quase todo reformulado para que se tornasse uma visualização mais adequada e suportasse todos os alimentos da nossa base de dados.

Comentários e sugestões que não foram implementados por fugirem do escopo (por não se tratarem diretamente de visualização), de forma que não eram prioridade para o nosso resultado final:
- “Uma adição: Uma grande parte dos usuários não entra no site com uma dieta definida em mente, e não tem tempo, conhecimento ou paciência para descobrir qual melhor se encaixa às suas necessidades. Ainda assim, essas pessoas têm interesse em melhorar sua saúde através de uma nutrição mais saudável. A minha recomendação é criar um algoritmo simples capaz de recomendar uma dieta padrão baseada nos objetivos do usuário. Isto é, se alguém almeja perder peso, fazer uma recomendação de um conjunto de alimentos de baixa gordura.”

- “Permitir que o usuário adicione uma lista de ingredientes e retorne uma outra lista de refeições que poderiam ser feitas ordenadas pelas necessidades de macronutrientes/calorias restantes diárias.”

### Links importantes
* [Notebook observable]()
* [Página do projeto final]()
* [Links do MVP]()
