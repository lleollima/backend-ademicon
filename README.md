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
### Insomnia

há dentro do projeto um arquivo chamado insomnia.json ma raiz do projeto para ser importado
no  programa insomnia. Nele há todos os endpoints criados no desenvolvimento desse projeto.

### Agradecimento

Gostaria de agradecer pela oportunidade , obrigado!