# 🔐 SecureBank Backend

### Resumo

Este projeto faz parte do plano de desenvolvimento profissional e aprendizado, focando na arquitetura e tecnologias envolvidas na construção de um sistema Backend utilizando NodeJS. O objetivo principal é replicar uma aplicação bancária, proporcionando uma oportunidade prática para aprimorar habilidades e conhecimentos no desenvolvimento de software.

### Descrição

O SecureBank Transactions é uma aplicação bancária altamente segura projetada para armazenar e gerenciar os dados transacionais dos seus usuários. Desenvolvida com os mais avançados padrões de segurança, a aplicação oferece uma experiência bancária confiável e protegida.

[![Node.js version](https://img.shields.io/badge/node-16.19.1-brightgreen.svg)](https://nodejs.org/en/blog/release/v16.19.1)
[![Npm version](https://img.shields.io/badge/npm-8.19.3-blue)](https://npm.im/npm)
[![Yarn version](https://img.shields.io/badge/yarn-1.22.19-blue)](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)

## 💻 Tecnologias utilizadas

- NodeJS
  - Plataforma de desenvolvimento para construir aplicações server-side em JavaScript. Utilizado como base para o desenvolvimento do backend.
- TypeScript
  - Superset do JavaScript que adiciona tipos estáticos à linguagem. Facilita a detecção de erros durante o desenvolvimento e melhora a manutenibilidade do código.
- PostgreSQL
  - Sistema de gerenciamento de banco de dados relacional. Utilizado para armazenar e gerenciar os dados transacionais dos usuários.
- TypeORM
  - Framework de ORM (Object-Relational Mapping) para NodeJS e TypeScript. Facilita a interação com o banco de dados PostgreSQL, proporcionando uma camada de abstração para operações CRUD.
- InversifyJS
  - Contêiner de inversão de controle para TypeScript e JavaScript. Utilizado para aplicar o princípio de inversão de controle, melhorando a modularidade e testabilidade do código.
- Express Validator
  - Middleware para Express utilizado para validar dados de entrada. Contribui para garantir a integridade e validade dos dados recebidos pela aplicação.
- Jsonwebtoken
  - Biblioteca para geração e verificação de JSON Web Tokens (JWT). Utilizado para implementar a autenticação na aplicação, garantindo a segurança das transações.
- OTP Library (otplib)
  - Biblioteca para geração e validação de códigos de autenticação de dois fatores (2FA). Implementa a autenticação de dois fatores para reforçar a segurança no acesso aos recursos da aplicação.
- QRCode
  - Biblioteca para geração de códigos QR. Utilizado para facilitar a configuração de chaves TOTP (Time-based One-Time Password) para autenticação de dois fatores.
- Crypto
  - Módulo nativo do NodeJS utilizado para operações criptográficas. Aplicado na criptografia das comunicações entre o backend e o frontend, garantindo a confidencialidade das informações transmitidas.

## 🚀 Para executar o projeto

1. Certifique-se de ter o [Node.js](https://nodejs.org/en/blog/release/v16.19.0), [NPM](https://npm.im/npm), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) e o [Git](https://git-scm.com), instalados em sua maquina de desenvolvimento, se atente as versões indicadas.
2. Ter as instancias do banco de dados [PostgreSQL](https://www.postgresql.org/) disponiveis e configuradas em seu ambiente de desenvolvimento (script: `yarn setup:local:up`).
3. Ambiente de desenvolvimento utilizado para execução local é o [VSCode](https://code.visualstudio.com/).
4. Execute a instancia usando o modo de depuração (debug) utilizando o atalho **F5**.

## ⚠️ Variáveis de Ambiente

Certifique-se de que as variáveis de ambiente necessárias estejam configuradas no arquivo `.vscode/launch.json`, em conjunto com suas configurações de inicialização.

Exemplo de envs utilizadas pode ser encontrado no arquivo `src/config/env/mock-env.ts`:

```bash
    NODE_ENV: 'mock',
    API_PORT: '3025',
    API_URL: 'http://localhost:3025',
    ADMIN_EMAIL: 'admin@email',
    ADMIN_PASSWORD: 'admin',
    BACKEND_PUBLIC_KEY: 'public-key',
    FRONTEND_PUBLIC_KEY: 'frontend-public-key',
    BACKEND_PRIVATE_KEY: 'private-key',
    FRONTEND_PRIVATE_KEY: 'frontend-private-key',
    HASH_SALT_ROUNDS: '1',
    AUTHENTICATION_TOKEN_EXPIRATION_IN_MINUTES: '2',
    REFRESH_TOKEN_EXPIRATION_IN_HOURS: '8',
    REFRESH_TOKEN_EXPIRATION_IN_DAYS: '30',
    JWT_SECRET_TOKEN: 'secret',
    JWT_SECRET_REFRESH_TOKEN: 'secret-refresh',
    APP_NAME: 'SECURE-BANK-API',
    DATABASE_POOL_MAX: '20',
    DATABASE_ACQUIRE: '5000',
    DATABASE_IDLE: '30000',
    DATABASE_HOST: 'localhost',
    DATABASE_NAME: 'db',
    DATABASE_USER: 'user',
    DATABASE_PASSWORD: 'password',
    DATABASE_PORT: '5433',
```

## 🈁 Configurações Adicionais

O projeto utiliza configurações específicas no VSCode para formatação e apresentação. Estas configurações estão definidas no arquivo `.vscode/settings.json`.

## 🚴 Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/UbiraEFC/SecureBank_Transactions.git
```

Entre no diretório do projeto

```bash
  cd SecureBank
```

Instale as dependências

```bash
  yarn install
```

Inicie o servidor

```bash
  Pressione F5 no VSCODE
```

## 💪 Testes

Testes

```bash
  yarn test
```

Testes com diagrama de cobertura

```bash
  yarn test:coverage
```

## 🎌 Commits

Para a realização de commits na aplicação deve-se atentar as regras estabelecidas pela convenção de [Conventional Commits Pattern](https://blog.geekhunter.com.br/o-que-e-commit-e-como-usar-commits-semanticos/).

    build: Alterações que afetam o sistema de construção ou dependências externas (escopos de exemplo: gulp, broccoli, npm);

    ci: Mudanças em nossos arquivos e scripts de configuração de CI (example scopes: Travis, Circle, BrowserStack, SauceLabs);

    docs: Referem-se a inclusão ou alteração somente de arquivos de documentação;

    feat: Tratam adições de novas funcionalidades ou de quaisquer outras novas implantações ao código;

    fix: Essencialmente definem o tratamento de correções de bugs;

    perf: Uma alteração de código que melhora o desempenho;

    refactor: Tipo utilizado em quaisquer mudanças que sejam executados no código, porém não alterem a funcionalidade final da tarefa impactada;

    style: Alterações referentes a formatações na apresentação do código que não afetam o significado do código, como por exemplo: espaço em branco, formatação, ponto e vírgula ausente etc;

    test: Adicionando testes ausentes ou corrigindo testes existentes nos processos de testes automatizados (TDD);

    chore: Atualização de tarefas que não ocasionam alteração no código de produção, mas mudanças de ferramentas, mudanças de configuração e bibliotecas que realmente não entram em produção;

    env: Basicamente utilizado na descrição de modificações ou adições em arquivos de configuração em processos e métodos de integração contínua (CI), como parâmetros em arquivos de configuração de containers;

## 📥📤 Migrations

Criando migrations

```bash
  npm run migration:create --name="Table"
```

Revertendo migrations

```bash
  npx typeorm migration:revert -n EntityName
```

Mais informações:

_[CLIQUE AQUI](https://typeorm.io/migrations)_
