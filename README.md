# L2 Desafio Backend

Este repositório contém as soluções para o desafio técnico de backend da L2, dividido em duas questões:

- **Questão 1**: API de empacotamento usando NestJS
- **Questão 2**: API com banco de dados PostgreSQL usando Node.js/Express

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Node.js (opcional, apenas se quiser rodar sem Docker)

---

## 🎯 Questão 1 - API de Empacotamento (NestJS)

### 📍 Localização
```
questao1/l2-packing/
```

### 🚀 Como rodar com Docker

```bash
# Navegar para a pasta da questão 1
cd questao1/l2-packing

# Rodar com docker-compose (recomendado)
docker-compose up

# Ou rodar com Docker diretamente
docker build -t l2-packing .
docker run -p 3000:3000 -e AUTH_TOKEN=valid-token-123 l2-packing
```
### Lembre de utilizar o Bearer token para auth correto na requisição do metodo POST sendo o token unico, o mesmo se encontra com mais detalhes no codigo com uso da biblioteca Passport: Bearer valid-token-123


A API estará disponível em: `http://localhost:3000`


### 🧪 Como rodar os testes

```bash
npm run test
```

### 📚 Documentação da API

Acesse `http://localhost:3000/docs` para ver a documentação Swagger.

---

## 🗄️ Questão 2 - API com PostgreSQL

### 📍 Localização
```
questao2/
```

### É ncessario copiar o arquivo schema.sql e seed.sql dentro do banco de dados para funcionamento correto, o banco de dados pode ser criaro pelo arquivo docker

### 🚀 Como rodar com Docker

```bash
# Navegar para a pasta da questão 2
cd questao2

# Copiar arquivo de ambiente
cp .env.example .env

# Subir o banco de dados PostgreSQL
docker-compose up -d
# Rodar a aplicação
npm install
npm run dev
```

A API estará disponível em: `http://localhost:3000`

### 🗃️ Schema e Seeds do Banco

O projeto já inclui:
- `schema.sql` - Estrutura das tabelas
- `seeds.sql` - Dados iniciais para teste

### 🔧 Configuração do Banco

Configurações padrão no `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha
DB_NAME=escola
```

### 🧪 Como testar as APIs

Use o arquivo `collection.http` incluído no projeto para testar os endpoints.

---