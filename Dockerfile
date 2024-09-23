# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./
COPY ./src ./src
COPY tsconfig.json .

# Instala as dependências
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Compila o TypeScript
RUN npm run build

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta em que o app será executado
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "run", "start"]
