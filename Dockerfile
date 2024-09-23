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
ENV PORT=3000
ENV MONGODB_URI=mongodb+srv://lleollima:teste123@cluster0.yyl7i.mongodb.net/ademicon?retryWrites=true&w=majority&appName=Cluster0

# Expõe a porta em que o app será executado
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "run", "start"]
