const express = require('express')
var exphbs = require('express-handlebars');
var cors = require('cors')
const morgan = require('morgan');
const { join } = require('path');

const app = express();

var hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    // partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
});

app.use(cors());
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('home');
});



app.set('port', process.env.PORT || 4000)

module.exports = app