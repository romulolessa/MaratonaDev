//0.1 -Configurando o servidor
//npm intall express
//npm install nodemon
//npm install pg

//configurando servidor
const express = require("express")
const server = express();

//configurar o servidor para apresentar arquivos estaticos(extras como css, img)
server.use(express.static('public'))

//habilitar body doo formulario
server.use(express.urlencoded({extended: true}))

//configurando a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'postgre',
    host: 'localhost',
    port:  5433,
    database: 'doe'
})

//confugurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})
//configurar a apresentação da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados.")
        
        const donors = result.rows;
        return res.render("index.html", {donors})
    })
});
server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos sao obrigatorios")
    }
    // coloca valores dentro do banco de dados
    const query = `INSERT INTO donors('name, email, blood') VALUES($1,$2,$3)    `
    const values = [name, email, blood]
    db.query(query, values, function(err){
        //fluxo de erro
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados");
        }

        return res.redirect("/")
    })
})
// liga o servidor e permiti acesso a porta 3000
server.listen(3000)