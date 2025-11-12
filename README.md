# 🥐 Sistema de Cantina Escolar

Sistema web completo para gerenciamento de estoque de cantina escolar, desenvolvido com Node.js, Express, PostgreSQL e EJS.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Como Usar](#-como-usar)
- [Testando o Sistema](#-testando-o-sistema)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Troubleshooting](#-troubleshooting)

---

## 📖 Sobre o Projeto

Sistema desenvolvido para facilitar o controle de estoque em cantinas escolares, permitindo:
- Cadastro e controle de produtos
- Gestão de entrada e saída de estoque
- Alertas de estoque baixo
- Dashboard com estatísticas
- Sistema de autenticação e autorização

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login seguro com usuário e senha
- Sessão persistente
- Logout com limpeza de sessão

### 📦 Gestão de Produtos
- Cadastro de produtos com:
  - SKU (código único)
  - Nome, marca e modelo
  - Descrição e unidade de medida
  - Estoque mínimo configurável
  
### 📊 Gestão de Estoque
- Registro de entrada de produtos
- Registro de saída de produtos
- Histórico completo de movimentações
- Cálculo automático de saldo
- Observações em cada movimentação

### 📈 Dashboard
- Total de produtos cadastrados
- Total de movimentações
- Lista de produtos com estoque baixo
- Alertas visuais para itens críticos

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **express-session** - Gerenciamento de sessões
- **bcryptjs** - Criptografia de senhas (preparado para implementação)

### Frontend
- **EJS** - Template engine
- **CSS3** - Estilização
- **HTML5** - Estrutura

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 14 ou superior)
  - [Download Node.js](https://nodejs.org/)
  
- **PostgreSQL** (versão 12 ou superior)
  - [Download PostgreSQL](https://www.postgresql.org/download/)

- **Git** (opcional, para clonar o repositório)
  - [Download Git](https://git-scm.com/)

---

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
git clone https://github.com/seu-usuario/sistema-cantina.git
cd sistema-cantina
```

Ou baixe e extraia o arquivo ZIP do projeto.

### 2. Instale as dependências

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`:
- express
- ejs
- express-session
- pg (driver PostgreSQL)
- bcryptjs

---

## 🗄️ Configuração do Banco de Dados

### 1. Inicie o PostgreSQL

Certifique-se de que o serviço PostgreSQL está rodando.

**Windows:**
- O serviço inicia automaticamente, ou use `services.msc`

**Linux/Mac:**
```bash
sudo service postgresql start
# ou
brew services start postgresql
```

### 2. Execute o script de criação do banco

Abra o terminal/prompt de comando e execute:

```bash
psql -U postgres
```

Digite a senha do seu usuário postgres (padrão: `12345` no código).

### 3. Execute o arquivo setup.sql

Dentro do psql:

```sql
\i 'C:/Users/professor/Desktop/sistema-cantina/setup.sql'
```

**Ou copie e cole o conteúdo do arquivo `setup.sql` diretamente no terminal do psql.**

### 4. Configure a conexão no server.js

Abra o arquivo `server.js` e ajuste as credenciais se necessário:

```javascript
const pool = new Pool({
  user: "postgres",       // Seu usuário do PostgreSQL
  host: "localhost",      
  database: "cantina_db", 
  password: "12345",      // Sua senha do PostgreSQL
  port: 5432,
});
```

---

## 🎯 Como Usar

### 1. Inicie o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

### 2. Acesse o sistema

Abra seu navegador e acesse:

```
http://localhost:3000
```

### 3. Faça login

Use uma das credenciais de teste (veja seção [Credenciais de Teste](#-credenciais-de-teste)).

### 4. Navegue pelo sistema

- **Dashboard** - Visão geral e estatísticas
- **Cadastro de Produto** - Adicione novos produtos
- **Gestão de Estoque** - Registre entradas e saídas

---

## 🧪 Testando o Sistema

### Teste 1: Login
1. Acesse `http://localhost:3000`
2. Use: usuário `admin` e senha `admin123`
3. Verifique se é redirecionado para o dashboard

### Teste 2: Cadastro de Produto
1. No dashboard, clique em "📦 Cadastro de Produto"
2. Preencha os campos:
   - SKU: `PROD001`
   - Nome: `Suco de Laranja`
   - Marca: `Marca X`
   - Modelo: `500ml`
   - Descrição: `Suco natural de laranja`
   - Unidade: `Caixa`
   - Estoque Mínimo: `10`
3. Clique em "Cadastrar"
4. Verifique a mensagem de sucesso

### Teste 3: Entrada de Estoque
1. Vá para "📊 Gestão de Estoque"
2. Selecione o produto cadastrado
3. Escolha tipo: "Entrada"
4. Quantidade: `50`
5. Data: (data atual)
6. Observação: `Compra inicial`
7. Clique em "Registrar"
8. Verifique o histórico de movimentações

### Teste 4: Saída de Estoque
1. Na mesma tela, registre uma saída
2. Quantidade: `45`
3. Verifique que o saldo é calculado automaticamente
4. Produto deve aparecer no dashboard como "estoque baixo"

### Teste 5: Alerta de Estoque Baixo
1. Volte ao Dashboard
2. Verifique a seção "🔔 Produtos com estoque baixo"
3. O produto deve aparecer listado (saldo 5 < mínimo 10)

---

## 📁 Estrutura do Projeto

```
sistema-cantina/
│
├── 📄 server.js              # Servidor principal (backend)
├── 📄 setup.sql              # Script de criação do banco
├── 📄 package.json           # Dependências do projeto
├── 📄 README.md              # Esta documentação
│
├── 📁 public/                # Arquivos públicos
│   └── style.css             # Estilos CSS
│
└── 📁 views/                 # Templates EJS
    ├── login.ejs             # Tela de login
    ├── dashboard.ejs         # Dashboard principal
    ├── cadastro-produto.ejs  # Formulário de cadastro
    └── gestao-estoque.ejs    # Gestão de movimentações
```

---

## 🔑 Credenciais de Teste

O sistema vem com 3 usuários pré-cadastrados:

| Nome | Usuário | Senha | Função |
|------|---------|-------|--------|
| Admin Teste | `admin` | `admin123` | Administrador |
| João da Silva | `joao.s` | `joao123` | Almoxarife |
| Maria Souza | `maria.s` | `maria123` | Almoxarife |

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"
**Solução:**
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `server.js`
- Teste a conexão manualmente com `psql -U postgres`

### Erro: "Port 3000 already in use"
**Solução:**
- Altere a porta no final do `server.js`:
```javascript
const PORT = 3001; // Troque para outra porta
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

### Erro: "relation 'products' does not exist"
**Solução:**
- Execute o arquivo `setup.sql` novamente
- Verifique se está conectado ao banco correto: `\c cantina_db`

### Página não carrega CSS
**Solução:**
- Limpe o cache do navegador (Ctrl + Shift + Del)
- Verifique se a pasta `public/` existe
- Reinicie o servidor

### Sessão não persiste após login
**Solução:**
- Limpe os cookies do navegador
- Verifique se `express-session` está instalado: `npm install express-session`

---

## 📝 Funcionalidades Futuras

- [ ] Criptografia real de senhas (bcryptjs já está instalado)
- [ ] Relatórios em PDF
- [ ] Gráficos de movimentação
- [ ] Exportação de dados para Excel
- [ ] Sistema de backup automático
- [ ] Múltiplos níveis de acesso
- [ ] Notificações por email

---

## 👨‍💻 Autor

**Professor Eduardo Correia**
- Versão: 2025
- Sistema desenvolvido para fins educacionais

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença ISC.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Revise os logs do servidor no terminal
3. Verifique os logs do PostgreSQL
4. Abra uma issue no repositório do projeto

---

**Desenvolvido com ❤️ para facilitar a gestão de cantinas escolares**
