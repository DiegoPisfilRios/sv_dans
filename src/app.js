const express = require('express')
var exphbs = require('express-handlebars');
var cors = require('cors')
const morgan = require('morgan');
const path = require('path');

const app = express();
// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); 
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());
app.use(express.json({ limit: '50mb' }))

var hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get('views'), 'layouts'),
    // partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('home');
});

module.exports = app