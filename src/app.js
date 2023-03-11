const express = require('express')
var exphbs = require('express-handlebars');
var cors = require('cors')
const morgan = require('morgan');
const { join, dirname } = require('path');
const { fileURLToPath } = require('url');

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', join(__dirname, 'views')); 
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());
app.use(express.json({ limit: '50mb' }))

var hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    // partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// static files
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('home');
});

module.exports = app