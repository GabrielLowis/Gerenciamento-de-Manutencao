# Gerenciamento de Manutenção

Um sistema web desenvolvido para gerenciar manutenções preventivas e corretivas em ambientes industriais.

## Descrição

Este projeto visa fornecer uma interface intuitiva para o acompanhamento e registro de manutenções industriais, permitindo o controle eficiente de tarefas e equipamentos.

## Tecnologias Utilizadas

- **HTML5**: Estruturação das páginas web.
- **CSS3/SCSS**: Estilização e design responsivo.
- **JavaScript**: Funcionalidades interativas no front-end.
- **Node / Express**: Lógica de back-end e comunicação com o banco de dados.
- **MongoDB**: Banco de dados para armazenamento das informações.
- **ApexCharts.js**: Criação de gráficos para uma dashboard.

## Funcionalidades

- **Cadastro de Usuários**: Permite o registro de usuários com diferentes níveis de acesso (Administrador, Técnico, Usuário Comum).
- **Gerenciamento de Equipamentos**: Cadastro e edição de informações sobre os equipamentos industriais.
- **Solicitação de Manutenção**: Usuários podem abrir solicitações de manutenção que são direcionadas aos técnicos responsáveis.
- **Acompanhamento de Status**: Visualização do progresso das manutenções em andamento.
- **Relatórios**: Geração de relatórios sobre manutenções realizadas, pendentes e estatísticas relevantes.
- **DashBoards**: Geração de Dashboards sobre desempenho e gerencimento de tasks. 

## Instalação

Para executar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/GabrielLowis/Gerenciamento-de-Manutencao.git
   ```

2. **Configure o servidor local**:

   - Utilize uma ferramenta como [XAMPP](https://www.apachefriends.org/pt_br/index.html) ou [Laragon](https://laragon.org/) para configurar um servidor Apache com suporte a PHP e MySQL.

3. **Importe o banco de dados**:

   - Localize o arquivo `database.sql` no repositório.
   - Utilize o phpMyAdmin ou outro gerenciador de banco de dados para importar o arquivo e criar as tabelas necessárias.

4. **Configure as credenciais do banco de dados**:

   - No arquivo `config.php`, ajuste as credenciais de acesso ao banco de dados conforme sua configuração local.

5. **Inicie o servidor**:

   - Coloque os arquivos do projeto na pasta `htdocs` (ou equivalente) do seu servidor local.
   - Inicie o servidor Apache e acesse o projeto através do navegador, geralmente em `http://localhost/Gerenciamento-de-Manutencao`.

## Uso

1. **Acesse o sistema**:

   - Utilize as credenciais padrão ou crie um novo usuário para acessar o sistema.

2. **Navegue pelas funcionalidades**:

   - Utilize o menu para acessar as diferentes seções: Usuários, Equipamentos, Solicitações de Manutenção, Relatórios, etc.

3. **Registre uma nova manutenção**:

   - Vá até a seção de solicitações e preencha o formulário com as informações necessárias.

4. **Acompanhe o status**:

   - Verifique o andamento das manutenções na seção de status, onde é possível atualizar informações e concluir tarefas.


## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
 
