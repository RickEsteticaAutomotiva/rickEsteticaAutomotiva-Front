# Rick Estética Automotiva - Frontend

Sistema de gerenciamento para a Rick Estética Automotiva. Este projeto lida com o cadastro e gerenciamento de veículos para clientes.

## Pré-requisitos

Antes de executar este projeto, certifique-se de ter:

- Node.js instalado
- [Backend da Rick Estética Automotiva](https://github.com/RickEsteticaAutomotiva/RickEsteticaAutomotiva) em execução
- JSON Server para o banco de dados mock

## Instalação

1. Clone este repositório:
```bash
git clone <url-do-repositório>
```

2. Instale as dependências:
```bash
npm install
```

## Executando o Projeto

1. Inicie o servidor do banco de dados mock:
```bash
npx json-server --watch db.json --port 8081
```

2. Inicie a aplicação frontend:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Funcionalidades

- Autenticação de usuários (login/cadastro)
- Gerenciamento de veículos (operações CRUD)
- Design responsivo com navegação lateral
- Validações de formulários para:
  - CPF
  - Números de telefone
  - Placas de veículos

## Tecnologias Utilizadas

- HTML/CSS
- JavaScript (ES6+)
- Express.js
- JSON Server