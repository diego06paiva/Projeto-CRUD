const express = require("express"); // importando express

const exphbs = require("express-handlebars"); //importando express com handlebars

//const mysql = require("mysql"); - Máquina pessoal

//const mysql2 = require("mysql2") - Máquina do trabalho

const pool = require("./db/conn"); // importando conexão com o pool para conexão com banco de dados

const path = require("path"); // importando core module para selecionar pastas

const porta = 3000; //expondo porta

const app = express(); // colocando o express na váriavel app

const basepath = path.join(__dirname, "views"); // comando para pegar a pasta views
app.set("views", path.join(__dirname, "views")); // informa o Express onde encontrar a pasta views
app.use(express.static(path.join(__dirname, "public"))); // comando para pegar a pasta de CSS

app.use(express.urlencoded({ extended: true })); // middleware para pegar os dados URL
app.use(express.json()); //middleware para pegar requisições JSON

app.engine("handlebars", exphbs.engine({ defaultLayout: false })); // configura o motor de templates handlebars
app.set("view engine", "handlebars"); // define handlebars como o padrão de visualização

app.get("/app", (req, res) => {
  // código que manda uma página para o usuario
  res.sendFile(`${basepath}/app.html`); // arquivo onde está a página
});

app.post("/enviar-dados/livros", (req, res) => {
  // código que pega dados que o usuario mandou
  const titulos = req.body.titulos;
  const paginas = req.body.paginas;

  const sql = `INSERT INTO livros (??, ??) VALUES (?, ?)`; // inserir o que o usuario mandou no banco de dados

  const values = ["titulos", "paginas", titulos, paginas];

  pool.query(sql, values, function (err) {
    // esse query é pra transformar o código em SQL
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }

    res.redirect("/"); // se tudo ocorrer corretamente ele redireciona para a pasta principal
  });
});

app.get("/livros", (req, res) => {
  // manda o usuario para a página /livros
  const sql = "SELECT * FROM livros"; // comandos SQL

  pool.query(sql, function (err, dados) {
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }
    const livros = dados;

    res.render("livros", { livros });
  });
});

app.get("/dados/:id", (req, res) => {
  // manda o usuario para a página /dados/:id e esse id é selecionado na hora que se clica em um livro
  const id = req.params.id; // aqui ele pega o parametro de id vindo da página /dados/:id lá da pasta views

  const sql = `SELECT * FROM livros WHERE ?? = ?`;

  const value = ["id", id];

  pool.query(sql, value, function (err, dados) {
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }
    const livros = dados[0];
    res.render("dados", { livros });
  });
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(basepath, "index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(basepath, "index.html"));
});

app.get("/livros/edit/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM livros WHERE ?? = ?`;

  const value = ["id", id];

  pool.query(sql, value, function (err, dados) {
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }

    const livrosed = dados[0];
    res.render("livrosed", { livrosed });
  });
});

app.post("/livros/livrosed/", (req, res) => {
  const id = req.body.id;
  const titulos = req.body.titulos;
  const paginas = req.body.paginas;

  const sql = `UPDATE livros SET titulos = ?, paginas = ? WHERE id = ?`;

  const values = [titulos, paginas, id];

  pool.query(sql, values, function (err) {
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }
  });

  res.redirect("/livros");
});

app.post("/livros/remover/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM livros WHERE ?? = ?`;

  const value = ["id", id];

  pool.query(sql, value, function (err) {
    if (err) {
      console.log(`ERRO: ${err}`);
      return;
    }
    res.redirect("/livros");
  });
});

app.listen(porta, () => {
  // código para rodar a porta
  console.log(`Rodando na porta 3000`);
});
