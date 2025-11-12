-- 🗃️ Criar banco
CREATE DATABASE cantina_db;

-- Conectar ao banco
\c cantina_db;

-- 🧑 Usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 🍞 Produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  description TEXT,
  unit TEXT,
  qty INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 📋 Movimentações de estoque
CREATE TABLE IF NOT EXISTS stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('entrada','saida')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  movement_date DATE NOT NULL,
  balance_after INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 👩‍💼 Inserir usuários
INSERT INTO users (name, username, password_hash, role) VALUES
('Admin Teste', 'admin', 'admin123', 'admin'),
('João da Silva', 'joao.s', 'joao123', 'almoxarife'),
('Maria Souza', 'maria.s', 'maria123', 'almoxarife');

-- 🧰 Inserir produtos
INSERT INTO products (sku, name, brand, model, description, unit, qty, min_stock)
VALUES
('REF-COL-350', 'Refrigerante Coca-Cola 350ml', 'Coca-Cola', 'Lata 350ml', 'Bebida gaseificada sabor cola.', 'unidade', 30, 10),
('SALG-QUEI-UN', 'Salgado de Queijo', 'Forno & Sabor', 'Mini Queijo', 'Salgado assado recheado com queijo mussarela.', 'unidade', 50, 10),
('BIS-CHO-90', 'Biscoito Recheado de Chocolate 90g', 'Nestlé', 'Negresco', 'Biscoito crocante com recheio sabor chocolate.', 'unidade', 40, 8);


-- 🧾 Movimentações iniciais
INSERT INTO stock_movements (product_id, user_id, type, quantity, movement_date, balance_after, note)
VALUES
(1,1,'entrada',5, CURRENT_DATE - INTERVAL '10 days', 15, 'Reforço de estoque'),
(2,2,'saida',1, CURRENT_DATE - INTERVAL '5 days', 4, 'Uso interno'),
(3,1,'entrada',3, CURRENT_DATE - INTERVAL '2 days', 11, 'Compra fornecedor');
