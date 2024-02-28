const express = require("express")
const exphbs = require('express-handlebars')
const mysql = require("mysql")



//Aqui estamos inicializando o Express, que é um framework para construir
// Aplicativos web em NodeJS
const app = express()


// Aqui estamos configurando o Express para usar o Middleware
// Para analisar dados de formulários enviados via POST
app.use(
    express.urlencoded({
        extended: true
    })
)

// Este Middleware permite que o Express analise dados em formato JSON
app.use(express.json())


// Aqui estamos configurando o Express para usar o handlebars como mecanismo
// de visualização para renderizar os modelos
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


// Este Middleware é usado para servir arquivos estáticos, como imagens, arquivos CSS e Javascript
app.use(express.static('public'))


// Definindo uma rota para a página inicial. Quando alguem acessa '/' no navegador, o servidor
// renderiza o modelo 'home'
app.get('/', (req, res) => {
    res.render("home")
})


// Esta rota é acionada quando alguem envia um formulário para adicionar um novo livro
app.post('/books/insertbook', (req, res) => {
    
    // Aqui estamos pegando os dados do formulário enviado pelo cliente
    const title = req.body.title
    const pageqti = req.body.pageqti

    // Criando uma consulta SQL para inserir os dados do livro no banco de dados
    const sql = `INSERT INTO books (title, pageqti) VALUES('${title}', ${pageqti})`

    // Executando a consulta SQL no banco de dados
    conn.query(sql, function (err) {
        if (err) {
            console.log(err)
            return
        }

        // Redicionando o usuário para a página de livros após a inserção bem-sucedida
        res.redirect('/books')
    })
})

// Rota para exibir todos os livros armazenados no banco de dados
app.get('/books', (req, res) => {
    // Consultando o banco de dados para obter todos os livros
    const sql = 'SELECT * FROM books'

    //Executa a consulta SQL
    conn.query(sql, function (err, dados) {
        if (err) {
            console.log(err)
            return
        }

        const books = dados
        console.log(books)

        //Renderizando a página de livros e passando os dados dos livros como contexto
        res.render('books', {books})
    })
})


//Rota para exibir detalhes de um livro especifico
app.get('/books/:id', (req, res) => {
    
    const id = req.params.id

    //Consultando o banco de dados para obter as informações do livro com ID fornecido
    const sql = `SELECT * FROM books WHERE id = ${id}`

    // Executando a consulta SQL 
    conn.query(sql, function (err, dados) {
        if (err) {
            console.log(err)
            return
        }

        const book = dados[0]

        // Renderizando a página de detalhes do livro
        // E passando o livro como contexto
        res.render('book', {book})
    })
})

// Rota para editar um livro especifico
app.get('/book/edit/:id', (req, res) => {
    
    const id = req.params.id


    // Consultando o banco de dados para obter as informações do livro com ID fornecido
    const sql = `SELECT * FROM books WHERE id = ${id}`


    // Executa a consulta SQL
    conn.query(sql, function (err, dados) {
        if (err) {
            console.log(err)
            return
        }

        const book = dados[0]

        // Renderiza a página de edição de livro, passando o livro como contexto
        res.render('editbook', {book})
    })

})

app.post('/books/updatebook', (req, res) => {
    
    const id = req.body.id
    const title = req.body.title
    const pageqti = req.body.pageqti

    const sql = `UPDATE books SET title = '${title}', pageqti = '${pageqti}' WHERE id = '${id}'`

    conn.query(sql, function (err) {
        if (err) {
            console.log(err)
            return
        }
        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) => {
    
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = '${id}'`

    conn.query(sql, function (err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })

})

// Configuração da conexão com o banco de dados MySQL
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vasco',
    database: 'nodesql'
})


// Estabelecendo a conexão com o banco de dados e iniciando o servidor Express na porta 3000
conn.connect(function (err) {
    if (err) {
        console.log(err)
    }
    console.log("Conectou ao mySQL")

    // Inicia o servidor Express na porta 3000
    app.listen(3000)
})


//01 - app.listen(port) - Este método é usado para iniciar o servidor Express HTTP na porta especificada
// O parâmetro 'port' é o número da porta em que o servidor irá ouvir

//Exemplo: app.listen(3000, ()=> {
    //console.log("Servidor rodando na porta 3000")
//})

// -----------------------------------------------------------------------------------------------------

//02 - app.get() - Este método é usado para definir uma rota HTTP que responde a solicitações GET
// As solicitações GET são usadas para recuperar recursos como páginas HTML, dados JSON de um servidor

//Exemplo: app.get('/', (req, res)=>{
    //res.send('Olá, mundo')
//})

//Neste exemplo, estamos definindo uma rota para o caminho raiz '/'.
// Quando alguem faz uma solicitação GET

// -----------------------------------------------------------------------------------------------------

//03 - app.post() - Este é um método usado para definir uma rota HTTP que responde a solicitação POST
// As solicitações POST são usadas para enviar dados para o servidor, geralmente para criar ou atualizar
// recursos

//Exemplo: app.post('/login', (req, res)=>{
    // const name = req.body.name
    // const senha = req.body.senha
//})

//


// -----------------------------------------------------------------------------------------------------
//04 - app.engine() - Este é  um método