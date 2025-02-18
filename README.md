# Frontend - School Management System

## 📌 Sobre o Projeto
Este é o frontend do sistema de gerenciamento escolar. Ele foi desenvolvido em **Angular**, utilizando **Angular Material** para componentes visuais e **RxJS** para gerenciamento de estados assíncronos. O projeto segue a abordagem de **Standalone Components**, utilizando **app.config.ts** e **app.routes.ts** ao invés de um AppModule tradicional.

---

## 🛠️ Tecnologias Utilizadas
- **Angular**: v17+
- **Node.js**: v18+
- **Angular Material**
- **RxJS**
- **TailwindCSS**
- **ESLint + Prettier** (para padronização de código)

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Instalar Dependências
Certifique-se de que o **Node.js** e o **Angular CLI** estão instalados:
```sh
npm install -g @angular/cli
```

Depois, dentro da pasta do projeto frontend, instale as dependências:
```sh
npm install
```

### 2️⃣ Rodar o Servidor Localmente
```sh
npm start
```
O projeto estará rodando em `http://localhost:4200/`

### 3️⃣ Configurar o Ambiente
Crie um arquivo `.env` (se necessário) ou edite `environment.ts` para apontar para a API backend:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

---

## 📂 Estrutura de Pastas
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/          # Serviços globais (auth, interceptors, etc.)
│   │   ├── shared/        # Interfaces, modelos e componentes compartilhados
│   │   ├── features/      # Componentes das telas principais
│   │   ├── app.config.ts  # Configuração do Angular Standalone
│   │   ├── app.routes.ts  # Rotas do Angular
│   ├── assets/
│   ├── environments/      # Configurações para diferentes ambientes
│   ├── main.ts            # Arquivo principal de inicialização
│   ├── index.html         # HTML raiz do projeto
```

---

## 📦 Bibliotecas Importantes
- `@angular/material` → Componentes visuais
- `@angular/forms` → Forms reativos
- `@angular/router` → Gerenciamento de rotas
- `rxjs` → Manipulação de eventos assíncronos
- `@angular/cdk` → Utilitários para acessibilidade e comportamento dinâmico
- `tailwindcss` → Estilização

---

## 🛠️ Comandos Utilitários
### Gerar um Componente
```sh
ng generate component features/nome-do-componente --standalone
```

### Gerar um Service
```sh
ng generate service services/nome-do-service
```

### Rodar o Linter
```sh
npm run lint
```

### Build para Produção
```sh
ng build --configuration=production
```

---

## 👥 Equipe e Contato
Caso precise de ajuda, entre em contato via **mateussilva651@gmail.com**.

---

Agora o frontend está pronto para desenvolvimento! 🎉

