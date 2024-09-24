# Backend API TESTE TÉCNICO ADEMICON

Este projeto é uma API RESTful desenvolvida com Node.js, Express e MongoDB. Ele fornece uma interface para gerenciar dados de vendedores, clientes, vendas e formas de pagamento, e inclui funcionalidades de geração de relatórios e integração com a API ViaCEP para consultar endereços via CEP.

## Tecnologias Utilizadas

- **Node.js**: Plataforma utilizada para desenvolver a aplicação.
- **Express**: Framework para construção de APIs em Node.js.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar os dados.
- **Mongoose**: Biblioteca de modelagem de dados para MongoDB e Node.js.
- **Axios**: Biblioteca para fazer requisições HTTP, usada para integrar com a API ViaCEP.
- **Docker**: Utilizado para criar um ambiente de desenvolvimento consistente.
- **TypeScript**: Linguagem utilizada para maior segurança e qualidade do código.

## Requisitos

- **Node.js** versão 14 ou superior
- **MongoDB** (local ou MongoDB Atlas)
- **Docker** (opcional, caso deseje rodar a aplicação em containers)
- **Yarn** ou **npm**

## Instalação

### Passo 1: Clonar o repositório

```bash
git clone git@github.com:lleollima/backend-ademicon.git
cd backend-ademicon
```
### Passo 2: Usando docker

```bash
docker compose build 
docker compose up

ou 

docker-compose build
docker-compose up

```

### Passo 2: Usando NPM ou YARN


```bash
npm install
npm run build
npm run start:dev

ou 

yarn
yarn build
yarn start:dev


```

### Passo 3: Consumindo a API


```bash
http://localhost:3000


```

### Estrutura do Projeto 

```bash

├── src
│   ├── controllers      # Lógica das rotas
│   ├── models           # Modelos do Mongoose
│   ├── routes           # Definição das rotas da API
│   ├── helpers          #  Métodos de ajuda reaproveitaveis e integração com APIs externas
│   ├── configs          # Configurações
│   ├── services         # Configuração de serviços externos
│   └── index.ts         # Inicialização do servidor
├── docker-compose.yml   # Configuração do Docker
├── .env                 # Variáveis de ambiente
└── README.md            # Documentação do projeto

```

### Funcionalidades 

- Vendedores: CRUD completo para gerenciar vendedores.
- Clientes: CRUD completo para gerenciar clientes.
- Vendas: Registra vendas com dados de clientes e vendedores.
- Formas de Pagamento: CRUD para diferentes métodos de pagamento.
- Relatórios: Geração de relatórios de vendas por data e vendedor.
- Consulta de Endereço: Integração com a API ViaCEP para buscar informações de endereço com base no CEP.

### Endpoints


#### Vendedores
- GET /sellers: Retorna todos os vendedores.
- GET /sellers/:id: Retorna detalhes de um vendedor
- POST /sellers: Cria um novo vendedor.
- PATCH /sellers/:id: Atualiza os dados de um vendedor.
- DELETE /sellers/:id: Remove um vendedor.
#### Clientes
- GET /clients: Retorna todos os clientes.
- GET /clients/:id: Retorna detalhes de um vendedor
- POST /clients: Cria um novo cliente.
- PATCH /clients/:id: Atualiza os dados de um cliente.
- DELETE /clients/:id: Remove um cliente.
#### Vendas
- GET /sales: Retorna todas as vendas.
- GET /sales/:id: Retorna detalhes de uma venda
- POST /sales: Registra uma nova venda.
- PATCH /sales/:id: Atualiza os dados de uma venda.
- DELETE /sales/:id: Remove uma venda.
#### Tipos de Pagamento
- GET /typesofpayment: Retorna todos os tipos de pagamento.
- GET /typesofpayment/:id: Retorna detalhes de um tipo de pagamento.
- POST /typesofpayment: Registra um novo tipo de pagamento.
- PATCH /typesofpayment/:id: Atualiza os dados de um tipo de pagamento.
- DELETE /typesofpayment/:id: Remove um tipo de pagamento.
#### Relatórios
- GET /sales-by-seller: Retorna todos os vendedores e suas comissões.
- GET /total-customer: Retorna o total de clientes
- GET /sales-by-payments-type: Retorna as vendas agrupadas por tipo de pagamento.


### Insomnia

há dentro do projeto um arquivo chamado insomnia.json ma raiz do projeto para ser importado
no  programa insomnia. Nele há todos os endpoints criados no desenvolvimento desse projeto.

### Agradecimento

Gostaria de agradecer pela oportunidade , obrigado!