// 🥐 Sistema Cantina Escolar - Versão Simplificada
// 🚀 Stack: Node.js + Express + PostgreSQL + EJS
// 👨‍🏫 Professor: Eduardo Correia (versão 2025)

import express from "express";
import session from "express-session";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🔌 Conexão com PostgreSQL
const pool = new Pool({
  user: "postgres",       // Usuário do seu banco
  host: "localhost",      // Servidor local
  database: "cantina_db", // Banco criado
  password: "12345",      // Senha do postgres
  port: 5432,
});

// ⚙️ Configurações globais
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "cantina2025",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🔒 Middleware para proteger rotas
function proteger(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  next();
}

// 🧰 Função para consultar o banco
async function runQuery(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

// 🏠 LOGIN
app.get("/", (req, res) => res.render("login", { erro: null }));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await runQuery(
      "SELECT * FROM users WHERE username=$1 AND password_hash=$2",
      [username, password]
    );

    if (user.length === 0) {
      return res.render("login", { erro: "Usuário ou senha incorretos!" });
    }

    req.session.user = user[0];
    res.redirect("/dashboard");
  } catch (err) {
    res.send("Erro ao tentar autenticar: " + err.message);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// 🧭 DASHBOARD
app.get("/dashboard", proteger, async (req, res) => {
  const produtosBaixos = await runQuery("SELECT * FROM products WHERE qty < min_stock ORDER BY name");
  const totalProdutos = (await runQuery("SELECT COUNT(*) FROM products"))[0].count;
  const totalMov = (await runQuery("SELECT COUNT(*) FROM stock_movements"))[0].count;

  res.render("dashboard", {
    usuario: req.session.user,
    produtosBaixos,
    totalProdutos,
    totalMov
  });
});

// 📦 CADASTRO DE PRODUTO
app.get("/cadastro-produto", proteger, async (req, res) => {
  const busca = req.query.busca || "";
  const produtos = await runQuery(
    busca
      ? "SELECT * FROM products WHERE name ILIKE $1 ORDER BY name"
      : "SELECT * FROM products ORDER BY name",
    busca ? [`%${busca}%`] : []
  );

  res.render("cadastro-produto", { usuario: req.session.user, produtos, busca });
});

app.post("/cadastro-produto", proteger, async (req, res) => {
  const { sku, name, brand, model, description, unit, qty, min_stock } = req.body;
  if (!name) return res.send("⚠️ Informe o nome do produto.");

  await runQuery(
    "INSERT INTO products (sku, name, brand, model, description, unit, qty, min_stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [sku, name, brand, model, description, unit, qty || 0, min_stock || 0]
  );

  res.redirect("/cadastro-produto");
});

app.post("/cadastro-produto/update/:id", proteger, async (req, res) => {
  const { id } = req.params;
  const { name, qty, min_stock } = req.body;

  await runQuery("UPDATE products SET name=$1, qty=$2, min_stock=$3 WHERE id=$4", [
    name,
    qty,
    min_stock,
    id,
  ]);

  res.redirect("/cadastro-produto");
});

app.post("/cadastro-produto/delete/:id", proteger, async (req, res) => {
  await runQuery("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.redirect("/cadastro-produto");
});

// 🧾 GESTÃO DE ESTOQUE
app.get("/gestao-estoque", proteger, async (req, res) => {
  const produtos = await runQuery("SELECT * FROM products ORDER BY name");
  const movimentos = await runQuery(`
    SELECT s.id, p.name AS produto, u.name AS usuario, s.type, s.quantity,
           TO_CHAR(s.movement_date, 'DD/MM/YYYY') AS data,
           s.balance_after, s.note
    FROM stock_movements s
    JOIN products p ON p.id = s.product_id
    JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC LIMIT 20
  `);

  res.render("gestao-estoque", { usuario: req.session.user, produtos, movimentos });
});

app.post("/gestao-estoque", proteger, async (req, res) => {
  const { product_id, type, quantity, movement_date, note } = req.body;
  const user_id = req.session.user.id;

  const produto = await runQuery("SELECT qty FROM products WHERE id=$1", [product_id]);
  const saldoAtual = produto[0].qty;
  const novoSaldo = type === "entrada" ? saldoAtual + Number(quantity) : saldoAtual - Number(quantity);

  await runQuery(
    "INSERT INTO stock_movements (product_id,user_id,type,quantity,movement_date,balance_after,note) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [product_id, user_id, type, quantity, movement_date, novoSaldo, note]
  );

  await runQuery("UPDATE products SET qty=$1 WHERE id=$2", [novoSaldo, product_id]);
  res.redirect("/gestao-estoque");
});

// 🚀 INICIA SERVIDOR
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);
