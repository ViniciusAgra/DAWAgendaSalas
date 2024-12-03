//APARENTEMENTE TUDO CERTO POIS CRIA A SESSÃO E DEMAIS INFORMAÇÕES IMPORTANTES

const express = require('express');
const {reservas, users} = require('./controllers');
const path = require('path');
var methodOverride = require('method-override');

const app = express();

const session = require('express-session');
const oneDay = 1000*60*60*24;
const sessionOptions = {
    secret: 'frasealeatoria',
    cookie:{maxAge: oneDay},
    resave: false,
    saveUninitialized: false
}

app.use(session(sessionOptions));

function secure_pass(req, res, next){
    console.log("Verificando sessão:", req.session.login);
    if(req.session.login == true){
        next();
    } else {
        res.redirect("/usuarios/login");
    }
}



//Traduzir os dados do corpo da requisição para variáveis
app.use(express.urlencoded({extended: true}));

//Indica que o formato dos dados seja JSON
app.use(express.json());

//Permite fazer requisições de tipos PUT/PATCH/DELETE e etc.
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Ouve requisições em /usuarios passa a rota para o controller users

app.use('/usuarios', users);

app.use(secure_pass);
//Ouve requisições em /comentarios passa a rota para o controller comments
//Middleware
app.use('/reservas', reservas);



app.listen(80, ()=>{
    console.log("Ouvindo na porta 80!")   
});